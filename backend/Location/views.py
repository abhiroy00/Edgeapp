from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from Location.models import ZoneMaster,DivisionMaster
from Location.serializer import ZoneMasterSerializer,DivisionMasterSerializer


class ZoneMasterListCreateAPIView(APIView):
    """
    Handles GET (list all) and POST (create new)
    """

    def get(self, request):
        zones = ZoneMaster.objects.all()
        serializer = ZoneMasterSerializer(zones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ZoneMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ZoneMasterDetailAPIView(APIView):
    """
    Handles GET (retrieve), PUT (update), DELETE (remove)
    """

    def get(self, request, pk):
        zone = get_object_or_404(ZoneMaster, pk=pk)
        serializer = ZoneMasterSerializer(zone)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        zone = get_object_or_404(ZoneMaster, pk=pk)
        serializer = ZoneMasterSerializer(zone, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        zone = get_object_or_404(ZoneMaster, pk=pk)
        zone.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class DivisionMasterAPIView(APIView):
    """
    API for DivisionMaster: List, Create, Retrieve, Update, Delete
    """

    def get(self, request, pk=None):
        if pk:  # Retrieve single division
            division = get_object_or_404(DivisionMaster, pk=pk)
            serializer = DivisionMasterSerializer(division)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:  # List all divisions
            divisions = DivisionMaster.objects.all()
            serializer = DivisionMasterSerializer(divisions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DivisionMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        division = get_object_or_404(DivisionMaster, pk=pk)
        serializer = DivisionMasterSerializer(division, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        division = get_object_or_404(DivisionMaster, pk=pk)
        division.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)