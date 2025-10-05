from django.shortcuts import render
from rest_framework.pagination import PageNumberPagination


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from junction.models import junctionboxmaster
from junction.serializer import JunctionBoxMasterSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class JunctionBoxMasterListCreateAPIView(APIView):
    def get(self, request):
        paginator = StandardResultsSetPagination()
        queryset = junctionboxmaster.objects.select_related("stationentity").order_by("junctionid")
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = JunctionBoxMasterSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = JunctionBoxMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JunctionBoxMasterDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return junctionboxmaster.objects.get(pk=pk)
        except junctionboxmaster.DoesNotExist:
            return None

    def get(self, request, pk):
        junction = self.get_object(pk)
        if not junction:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = JunctionBoxMasterSerializer(junction)
        return Response(serializer.data)

    def put(self, request, pk):
        junction = self.get_object(pk)
        if not junction:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = JunctionBoxMasterSerializer(junction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        junction = self.get_object(pk)
        if not junction:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        junction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






