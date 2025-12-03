from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.db.models import Q
from .models import TaskMaster, TypeMaster, StatusMaster, TaskAssignment
from .serializer import TaskMasterSerializer, TypeMasterSerializer, StatusMasterSerializer, TaskAssignmentSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from datetime import datetime, timedelta
from django.db import transaction


class BulkAssignAPIView(APIView):
    """
    Bulk assign tasks to users
    POST /api/task-assignments/bulk-assign/
    """
    def post(self, request):
        assignments = request.data.get('assignments', [])
        
        if not assignments:
            return Response({
                "error": "No assignments provided",
                "detail": "Please provide 'assignments' array"
            }, status=status.HTTP_400_BAD_REQUEST)

        updated_count = 0
        errors = []
        
        try:
            with transaction.atomic():
                for assignment_data in assignments:
                    task_id = assignment_data.get('taskassignmentid')
                    user_id = assignment_data.get('assigned_user')
                    
                    if not task_id or not user_id:
                        errors.append({"error": "Missing data", "data": assignment_data})
                        continue
                    
                    try:
                        task_assignment = TaskAssignment.objects.get(taskassignmentid=task_id)
                        task_assignment.assigned_user_id = user_id
                        task_assignment.save()
                        updated_count += 1
                        
                    except TaskAssignment.DoesNotExist:
                        errors.append({"error": "Not found", "taskassignmentid": task_id})
                    except Exception as e:
                        errors.append({"error": str(e), "taskassignmentid": task_id})
                
                if updated_count == 0 and errors:
                    raise Exception("All assignments failed")
        
        except Exception as e:
            return Response({
                "error": "Bulk assignment failed",
                "detail": str(e),
                "errors": errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "success": True,
            "message": f"Successfully assigned {updated_count} task(s)",
            "updated_count": updated_count,
            "errors": errors if errors else None
        }, status=status.HTTP_200_OK)


def auto_generate_schedule(task_master):
    """
    Helper function to automatically generate task assignments
    """
    today = datetime.now().date()
    end_date = task_master.schedulelimitdate
    frequency = task_master.frequency_days

    # Validate required fields
    if not end_date or not frequency or frequency <= 0:
        return 0, "Missing schedulelimitdate or frequency_days"

    total_days = (end_date - today).days
    
    if total_days <= 0:
        return 0, "Schedule limit date must be in the future"

    number_of_tasks = total_days // frequency

    if number_of_tasks == 0:
        return 0, f"Frequency ({frequency} days) is greater than remaining days ({total_days} days)"

    # Generate assignments
    created_count = 0
    try:
        for i in range(1, number_of_tasks + 1):
            scheduled_date = today + timedelta(days=i * frequency)

            if scheduled_date <= end_date:
                TaskAssignment.objects.create(
                    taskmaster=task_master,
                    task_number=i,
                    scheduled_date=scheduled_date,
                    status='pending'
                )
                created_count += 1
                
        print(f"[AUTO-GENERATE] Created {created_count} assignments for TaskMaster {task_master.taskmaster}")
        return created_count, None
        
    except Exception as e:
        # Rollback on error
        TaskAssignment.objects.filter(taskmaster=task_master).delete()
        print(f"[ERROR] Failed to auto-generate: {str(e)}")
        return 0, str(e)
class TaskMasterAPIView(APIView):
    """
    CRUD operations for TaskMaster with auto task generation
    """
    def get(self, request, pk=None):
        if pk:
            try:
                task = TaskMaster.objects.get(taskmaster=pk)
            except TaskMaster.DoesNotExist:
                return Response({
                    "error": "TaskMaster not found",
                    "detail": f"TaskMaster with ID {pk} does not exist"
                }, status=status.HTTP_404_NOT_FOUND)

            serializer = TaskMasterSerializer(task)
            
            assignment_count = TaskAssignment.objects.filter(taskmaster=task).count()
            response_data = serializer.data
            response_data['assignment_count'] = assignment_count
            
            return Response(response_data, status=status.HTTP_200_OK)

        queryset = TaskMaster.objects.all().order_by('-taskmaster')
        serializer = TaskMasterSerializer(queryset, many=True)
        
        data = serializer.data
        for item in data:
            task_id = item.get('taskmaster')
            if task_id:
                item['assignment_count'] = TaskAssignment.objects.filter(taskmaster_id=task_id).count()
        
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TaskMasterSerializer(data=request.data)
        if serializer.is_valid():
            task_master = serializer.save()
            
            created_count, error = auto_generate_schedule(task_master)
            
            response_data = {
                "success": True,
                "message": "TaskMaster created successfully",
                "data": serializer.data,
                "assignments_generated": created_count
            }
            
            if error:
                response_data["warning"] = f"Task created but assignments not generated: {error}"
            else:
                response_data["message"] = f"TaskMaster created with {created_count} task assignments"
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required",
                "detail": "Please provide a TaskMaster ID"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            task = TaskMaster.objects.get(taskmaster=pk)
        except TaskMaster.DoesNotExist:
            return Response({
                "error": "TaskMaster not found",
                "detail": f"TaskMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskMasterSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            task_master = serializer.save()
            
            schedule_fields = ['schedulelimitdate', 'frequency_days']
            if any(field in request.data for field in schedule_fields):
                old_count = TaskAssignment.objects.filter(taskmaster=task_master).count()
                TaskAssignment.objects.filter(taskmaster=task_master).delete()
                print(f"[UPDATE] Deleted {old_count} old assignments")
                
                created_count, error = auto_generate_schedule(task_master)
                
                response_data = {
                    "success": True,
                    "message": "TaskMaster updated and schedule regenerated",
                    "data": serializer.data,
                    "old_assignments": old_count,
                    "new_assignments": created_count
                }
                
                if error:
                    response_data["warning"] = f"Updated but assignments not regenerated: {error}"
            else:
                response_data = {
                    "success": True,
                    "message": "TaskMaster updated successfully",
                    "data": serializer.data
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required",
                "detail": "Please provide a TaskMaster ID"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            task = TaskMaster.objects.get(taskmaster=pk)
        except TaskMaster.DoesNotExist:
            return Response({
                "error": "TaskMaster not found",
                "detail": f"TaskMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        task_id = task.taskmaster
        assignment_count = TaskAssignment.objects.filter(taskmaster=task).count()
        
        task.delete()
        
        return Response({
            "success": True,
            "message": f"TaskMaster {task_id} and {assignment_count} assignments deleted successfully"
        }, status=status.HTTP_200_OK)



class GenerateScheduleAPIView(APIView):
    """
    Manual schedule generation/regeneration endpoint
    """
    def post(self, request, pk):
        try:
            task_master = TaskMaster.objects.get(taskmaster=pk)
        except TaskMaster.DoesNotExist:
            return Response({
                "error": "TaskMaster not found",
                "detail": f"TaskMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        existing_count = TaskAssignment.objects.filter(taskmaster=task_master).count()
        regenerate = request.data.get('regenerate', False)
        
        if existing_count > 0 and not regenerate:
            return Response({
                "error": "Task assignments already exist",
                "detail": f"Found {existing_count} existing assignments. Set 'regenerate': true to recreate them.",
                "existing_count": existing_count
            }, status=status.HTTP_400_BAD_REQUEST)

        if regenerate and existing_count > 0:
            TaskAssignment.objects.filter(taskmaster=task_master).delete()
            print(f"[REGENERATE] Deleted {existing_count} existing assignments for TaskMaster {pk}")

        created_count, error = auto_generate_schedule(task_master)
        
        if error:
            return Response({
                "error": "Failed to generate schedule",
                "detail": error
            }, status=status.HTTP_400_BAD_REQUEST)

        assignments = TaskAssignment.objects.filter(taskmaster=task_master).order_by('task_number')
        serializer = TaskAssignmentSerializer(assignments, many=True)
        
        return Response({
            "success": True,
            "message": f"Successfully generated {created_count} task assignments",
            "taskmaster_id": pk,
            "total_assignments": created_count,
            "assignments": serializer.data
        }, status=status.HTTP_201_CREATED)



class TaskAssignmentAPIView(APIView):
    """
    CRUD operations for TaskAssignment with filtering and pagination support
    """
    def get(self, request, pk=None):
        if pk:
            try:
                assignment = TaskAssignment.objects.select_related('taskmaster').get(taskassignmentid=pk)
                serializer = TaskAssignmentSerializer(assignment)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except TaskAssignment.DoesNotExist:
                return Response({
                    "error": "TaskAssignment not found",
                    "detail": f"TaskAssignment with ID {pk} does not exist"
                }, status=status.HTTP_404_NOT_FOUND)

        queryset = TaskAssignment.objects.select_related('taskmaster').all()

        taskmaster_id = request.GET.get('taskmaster')
        if taskmaster_id:
            queryset = queryset.filter(taskmaster_id=taskmaster_id)

        status_filter = request.GET.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        if start_date:
            queryset = queryset.filter(scheduled_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(scheduled_date__lte=end_date)

        queryset = queryset.order_by('scheduled_date', 'task_number')

        total_count = queryset.count()

        page = request.GET.get('page')
        page_size = request.GET.get('page_size', 100)
        
        if page:
            try:
                page = int(page)
                page_size = int(page_size)
                paginator = Paginator(queryset, page_size)
                page_obj = paginator.get_page(page)
                
                serializer = TaskAssignmentSerializer(page_obj.object_list, many=True)
                
                return Response({
                    "count": paginator.count,
                    "total_pages": paginator.num_pages,
                    "current_page": page_obj.number,
                    "page_size": page_size,
                    "has_next": page_obj.has_next(),
                    "has_previous": page_obj.has_previous(),
                    "results": serializer.data
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                print(f"[PAGINATION ERROR] {str(e)}")
                serializer = TaskAssignmentSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = TaskAssignmentSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TaskAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "TaskAssignment created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required",
                "detail": "Please provide an assignment ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            assignment = TaskAssignment.objects.get(taskassignmentid=pk)
        except TaskAssignment.DoesNotExist:
            return Response({
                "error": "TaskAssignment not found",
                "detail": f"TaskAssignment with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskAssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "TaskAssignment updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required",
                "detail": "Please provide an assignment ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            assignment = TaskAssignment.objects.get(taskassignmentid=pk)
        except TaskAssignment.DoesNotExist:
            return Response({
                "error": "TaskAssignment not found",
                "detail": f"TaskAssignment with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        assignment_id = assignment.taskassignmentid
        assignment.delete()
        
        return Response({
            "success": True,
            "message": f"TaskAssignment {assignment_id} deleted successfully"
        }, status=status.HTTP_200_OK)



class MarkCompleteAPIView(APIView):
    """Mark a task assignment as completed"""
    def post(self, request, pk):
        try:
            assignment = TaskAssignment.objects.get(taskassignmentid=pk)
        except TaskAssignment.DoesNotExist:
            return Response({
                "error": "TaskAssignment not found",
                "detail": f"TaskAssignment with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        assignment.completed_date = datetime.now().date()
        assignment.status = 'completed'
        assignment.notes = request.data.get("notes", assignment.notes or "")
        assignment.save()

        serializer = TaskAssignmentSerializer(assignment)
        return Response({
            "success": True,
            "message": "Task marked as completed",
            "data": serializer.data
        }, status=status.HTTP_200_OK)



class MarkPendingAPIView(APIView):
    """Mark a task assignment as pending"""
    def post(self, request, pk):
        try:
            assignment = TaskAssignment.objects.get(taskassignmentid=pk)
        except TaskAssignment.DoesNotExist:
            return Response({
                "error": "TaskAssignment not found",
                "detail": f"TaskAssignment with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        assignment.completed_date = None
        assignment.status = 'pending'
        assignment.save()

        serializer = TaskAssignmentSerializer(assignment)
        return Response({
            "success": True,
            "message": "Task marked as pending",
            "data": serializer.data
        }, status=status.HTTP_200_OK)



class BulkCompleteAPIView(APIView):
    """Mark multiple task assignments as completed"""
    def post(self, request):
        assignment_ids = request.data.get('assignment_ids', [])
        
        if not assignment_ids:
            return Response({
                "error": "No assignments specified",
                "detail": "Please provide 'assignment_ids' array"
            }, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(assignment_ids, list):
            return Response({
                "error": "Invalid format",
                "detail": "'assignment_ids' must be an array"
            }, status=status.HTTP_400_BAD_REQUEST)

        assignments = TaskAssignment.objects.filter(taskassignmentid__in=assignment_ids)
        found_count = assignments.count()
        
        if found_count == 0:
            return Response({
                "error": "No assignments found",
                "detail": "None of the provided IDs matched existing assignments"
            }, status=status.HTTP_404_NOT_FOUND)

        updated_count = assignments.update(
            completed_date=datetime.now().date(),
            status="completed"
        )

        return Response({
            "success": True,
            "message": f"{updated_count} task(s) marked as completed",
            "updated_count": updated_count,
            "requested_count": len(assignment_ids),
            "not_found_count": len(assignment_ids) - found_count
        }, status=status.HTTP_200_OK)



class TypeMasterAPIView(APIView):
    """
    CRUD operations for TypeMaster
    """
    def get(self, request, pk=None):
        if pk:
            try:
                typemaster = TypeMaster.objects.get(rid=pk)
                serializer = TypeMasterSerializer(typemaster)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except TypeMaster.DoesNotExist:
                return Response({
                    "error": "TypeMaster not found",
                    "detail": f"TypeMaster with ID {pk} does not exist"
                }, status=status.HTTP_404_NOT_FOUND)

        queryset = TypeMaster.objects.all().order_by("-rid")
        serializer = TypeMasterSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TypeMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Type created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required for update",
                "detail": "Please provide a TypeMaster ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            typemaster = TypeMaster.objects.get(rid=pk)
        except TypeMaster.DoesNotExist:
            return Response({
                "error": "TypeMaster not found",
                "detail": f"TypeMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TypeMasterSerializer(typemaster, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required for delete",
                "detail": "Please provide a TypeMaster ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            typemaster = TypeMaster.objects.get(rid=pk)
        except TypeMaster.DoesNotExist:
            return Response({
                "error": "TypeMaster not found",
                "detail": f"TypeMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        typemaster_id = typemaster.rid
        typemaster.delete()
        return Response({
            "success": True,
            "message": f"TypeMaster {typemaster_id} deleted successfully"
        }, status=status.HTTP_200_OK)



class StatusMasterAPIView(APIView):
    """
    CRUD operations for StatusMaster
    """
    def get(self, request, pk=None):
        if pk:
            try:
                statusmaster = StatusMaster.objects.get(sid=pk)
                serializer = StatusMasterSerializer(statusmaster)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except StatusMaster.DoesNotExist:
                return Response({
                    "error": "StatusMaster not found",
                    "detail": f"StatusMaster with ID {pk} does not exist"
                }, status=status.HTTP_404_NOT_FOUND)

        queryset = StatusMaster.objects.all().order_by("-sid")
        serializer = StatusMasterSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StatusMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Status created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required for update",
                "detail": "Please provide a StatusMaster ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            statusmaster = StatusMaster.objects.get(sid=pk)
        except StatusMaster.DoesNotExist:
            return Response({
                "error": "StatusMaster not found",
                "detail": f"StatusMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = StatusMasterSerializer(statusmaster, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "error": "Validation failed",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({
                "error": "ID required for delete",
                "detail": "Please provide a StatusMaster ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            statusmaster = StatusMaster.objects.get(sid=pk)
        except StatusMaster.DoesNotExist:
            return Response({
                "error": "StatusMaster not found",
                "detail": f"StatusMaster with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        statusmaster_id = statusmaster.sid
        statusmaster.delete()
        return Response({
            "success": True,
            "message": f"StatusMaster {statusmaster_id} deleted successfully"
        }, status=status.HTTP_200_OK)
