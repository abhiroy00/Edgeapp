from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.db.models import Q

from .models import TaskMaster, TypeMaster, StatusMaster
from .serializer import TaskMasterSerializer, TypeMasterSerializer, StatusMasterSerializer


# ✅ TASK MASTER VIEW
class TaskMasterAPIView(APIView):
    """
    CRUD + Search + Pagination for TaskMaster
    """

    def get(self, request, pk=None):
        # ✅ Single record
        if pk:
            try:
                task = TaskMaster.objects.get(pk=pk)
                serializer = TaskMasterSerializer(task)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except TaskMaster.DoesNotExist:
                return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        # ✅ List + Search + Pagination
        search = request.GET.get("search", "")
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 10))

        queryset = TaskMaster.objects.all().order_by("-taskmaster")

        if search:
            queryset = queryset.filter(
                Q(taskname__icontains=search)
                | Q(frequency_days__icontains=search)
                | Q(schedulelimitdate__icontains=search)
            )

        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)
        serializer = TaskMasterSerializer(page_obj, many=True)

        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TaskMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task created successfully", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = TaskMaster.objects.get(pk=pk)
        except TaskMaster.DoesNotExist:
            return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskMasterSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated successfully", "data": serializer.data},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for partial update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = TaskMaster.objects.get(pk=pk)
        except TaskMaster.DoesNotExist:
            return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskMasterSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Partially updated", "data": serializer.data},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required for delete"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = TaskMaster.objects.get(pk=pk)
        except TaskMaster.DoesNotExist:
            return Response({"error": "TaskMaster not found"}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


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

