from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

from .models import ScheduleCreation
from planner.serializer import ScheduleCreationSerializer


# Pagination Class
class SchedulePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class ScheduleCreationListCreateAPIView(APIView):
    """
    GET: List with search & pagination
    POST: Create
    """

    def get(self, request):
        query = ScheduleCreation.objects.all().order_by("-schedule")

        # Searching
        search = request.query_params.get("search")
        if search:
            query = query.filter(
                Q(task__taskname__icontains=search)
                | Q(maintenancetype__maintenancetypename__icontains=search)
                | Q(status__statusname__icontains=search)
                | Q(user__username__icontains=search)
            )

        # Ordering
        ordering = request.query_params.get("ordering")
        if ordering:
            query = query.order_by(ordering)

        # Pagination
        paginator = SchedulePagination()
        paginated_query = paginator.paginate_queryset(query, request)

        serializer = ScheduleCreationSerializer(paginated_query, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ScheduleCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Schedule created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleCreationDetailAPIView(APIView):
    """
    GET: Retrieve
    PUT: Update
    DELETE: Delete
    """

    def get_object(self, pk):
        try:
            return ScheduleCreation.objects.get(pk=pk)
        except ScheduleCreation.DoesNotExist:
            return None

    def get(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ScheduleCreationSerializer(obj)
        return Response(serializer.data)

    def put(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ScheduleCreationSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Schedule updated successfully", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response({"message": "Schedule deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
