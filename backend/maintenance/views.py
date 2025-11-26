from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.db.models import Q
from .models import TaskMaster, TypeMaster, StatusMaster, TaskAssignment
from .serializer import TaskMasterSerializer, TypeMasterSerializer, StatusMasterSerializer,TaskAssignmentSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, timedelta



class TaskMasterAPIView(APIView):

    def get(self, request, pk=None):
        if pk:
            try:
                task = TaskMaster.objects.get(pk=pk)
            except TaskMaster.DoesNotExist:
                return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = TaskMasterSerializer(task)
            return Response(serializer.data)

        # List all
        queryset = TaskMaster.objects.all()
        serializer = TaskMasterSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            task = TaskMaster.objects.get(pk=pk)
        except TaskMaster.DoesNotExist:
            return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskMasterSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            task = TaskMaster.objects.get(pk=pk)
        except TaskMaster.DoesNotExist:
            return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class GenerateScheduleAPIView(APIView):

    def post(self, request, pk):
        try:
            task_master = TaskMaster.objects.get(pk=pk)
        except TaskMaster.DoesNotExist:
            return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.data.get('regenerate', False):
            TaskAssignment.objects.filter(taskmaster=task_master).delete()

        today = datetime.now().date()
        end_date = task_master.schedulelimitdate
        frequency = task_master.frequency_days

        total_days = (end_date - today).days
        if total_days <= 0:
            return Response({"error": "Schedule limit date must be in the future"},
                            status=status.HTTP_400_BAD_REQUEST)

        number_of_tasks = total_days // frequency

        assignments = []
        for i in range(1, number_of_tasks + 1):
            scheduled_date = today + timedelta(days=i * frequency)

            if scheduled_date <= end_date:
                assignment = TaskAssignment.objects.create(
                    taskmaster=task_master,
                    task_number=i,
                    scheduled_date=scheduled_date,
                    status='pending'
                )
                assignments.append(assignment)

        serializer = TaskAssignmentSerializer(assignments, many=True)
        return Response({
            "message": f"Generated {len(assignments)} task assignments",
            "assignments": serializer.data
        })


class TaskAssignmentAPIView(APIView):

    def get(self, request, pk=None):
        queryset = TaskAssignment.objects.all()

        taskmaster_id = request.GET.get('taskmaster')
        status_filter = request.GET.get('status')

        if taskmaster_id:
            queryset = queryset.filter(taskmaster_id=taskmaster_id)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        if pk:
            try:
                task = TaskAssignment.objects.get(pk=pk)
            except TaskAssignment.DoesNotExist:
                return Response({"error": "TaskAssignment not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = TaskAssignmentSerializer(task)
            return Response(serializer.data)

        serializer = TaskAssignmentSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assignment = TaskAssignment.objects.get(pk=pk)
        except TaskAssignment.DoesNotExist:
            return Response({"error": "TaskAssignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskAssignmentSerializer(assignment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assignment = TaskAssignment.objects.get(pk=pk)
        except TaskAssignment.DoesNotExist:
            return Response({"error": "TaskAssignment not found"}, status=status.HTTP_404_NOT_FOUND)

        assignment.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class MarkCompleteAPIView(APIView):
    def post(self, request, pk):
        try:
            assignment = TaskAssignment.objects.get(pk=pk)
        except TaskAssignment.DoesNotExist:
            return Response({"error": "TaskAssignment not found"}, status=status.HTTP_404_NOT_FOUND)

        assignment.completed_date = datetime.now().date()
        assignment.status = 'completed'
        assignment.notes = request.data.get("notes", "")
        assignment.save()

        serializer = TaskAssignmentSerializer(assignment)
        return Response(serializer.data)


class MarkPendingAPIView(APIView):
    def post(self, request, pk):
        try:
            assignment = TaskAssignment.objects.get(pk=pk)
        except TaskAssignment.DoesNotExist:
            return Response({"error": "TaskAssignment not found"}, status=status.HTTP_404_NOT_FOUND)

        assignment.completed_date = None
        assignment.status = 'pending'
        assignment.save()

        serializer = TaskAssignmentSerializer(assignment)
        return Response(serializer.data)


class BulkCompleteAPIView(APIView):
    def post(self, request):
        ids = request.data.get('assignment_ids', [])
        assignments = TaskAssignment.objects.filter(id__in=ids)

        assignments.update(
            completed_date=datetime.now().date(),
            status="completed"
        )

        return Response({
            "message": f"{assignments.count()} tasks marked completed"
        })


# ✅ TYPE MASTER VIEW
class TypeMasterAPIView(APIView):
    """
    CRUD for TypeMaster
    """

    def get(self, request, pk=None):
        if pk:
            try:
                typemaster = TypeMaster.objects.get(pk=pk)
                serializer = TypeMasterSerializer(typemaster)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except TypeMaster.DoesNotExist:
                return Response({"error": "TypeMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = TypeMaster.objects.all().order_by("-rid")
        serializer = TypeMasterSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TypeMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Type created successfully", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            typemaster = TypeMaster.objects.get(pk=pk)
        except TypeMaster.DoesNotExist:
            return Response({"error": "TypeMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TypeMasterSerializer(typemaster, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated successfully", "data": serializer.data},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for delete"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            typemaster = TypeMaster.objects.get(pk=pk)
        except TypeMaster.DoesNotExist:
            return Response({"error": "TypeMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        typemaster.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# ✅ STATUS MASTER VIEW
class StatusMasterAPIView(APIView):
    """
    CRUD for StatusMaster
    """

    def get(self, request, pk=None):
        if pk:
            try:
                statusmaster = StatusMaster.objects.get(pk=pk)
                serializer = StatusMasterSerializer(statusmaster)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except StatusMaster.DoesNotExist:
                return Response({"error": "StatusMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        queryset = StatusMaster.objects.all().order_by("-sid")
        serializer = StatusMasterSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StatusMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Status created successfully", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            statusmaster = StatusMaster.objects.get(pk=pk)
        except StatusMaster.DoesNotExist:
            return Response({"error": "StatusMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StatusMasterSerializer(statusmaster, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated successfully", "data": serializer.data},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for delete"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            statusmaster = StatusMaster.objects.get(pk=pk)
        except StatusMaster.DoesNotExist:
            return Response({"error": "StatusMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        statusmaster.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

