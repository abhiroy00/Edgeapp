from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from Location.models import (ZoneMaster,
                             DivisionMaster,
                             StationMaster,
                             StationEntitiesMaster
                             )
from Location.serializer import (ZoneMasterSerializer,
                                 DivisionMasterSerializer,
                                 StationMasterSerializer,
                                 StationEntitiesMasterSerializer
                               )  
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q



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


class StationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ✅ List + Create
class StationMasterListCreateAPIView(APIView):
    def get(self, request):
        queryset = StationMaster.objects.all().order_by('stationid')

        # Filtering
        division = request.query_params.get('division')
        is_active = request.query_params.get('is_active')
        prefixcode = request.query_params.get('prefixcode')
        search = request.query_params.get('search')
        ordering = request.query_params.get('ordering')

        if division:
            queryset = queryset.filter(division=division)
        if is_active in ['true', 'false']:
            queryset = queryset.filter(is_active=(is_active == 'true'))
        if prefixcode:
            queryset = queryset.filter(prefixcode__iexact=prefixcode)
        if search:
            queryset = queryset.filter(
                Q(stationname__icontains=search) | Q(stationdesc__icontains=search)
            )
        if ordering:
            queryset = queryset.order_by(ordering)

        # Pagination
        paginator = StationPagination()
        paginated_qs = paginator.paginate_queryset(queryset, request)
        serializer = StationMasterSerializer(paginated_qs, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = StationMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Retrieve + Update + Delete
class StationMasterDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return StationMaster.objects.get(pk=pk)
        except StationMaster.DoesNotExist:
            return None

    def get(self, request, pk):
        station = self.get_object(pk)
        if not station:
            return Response({"error": "Station not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = StationMasterSerializer(station)
        return Response(serializer.data)

    def put(self, request, pk):
        station = self.get_object(pk)
        if not station:
            return Response({"error": "Station not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = StationMasterSerializer(station, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        station = self.get_object(pk)
        if not station:
            return Response({"error": "Station not found"}, status=status.HTTP_404_NOT_FOUND)
        station.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class StationEntitiesMasterListCreateAPIView(APIView):
    """
    GET: List all station entities with pagination and search
    POST: Create a new station entity
    """
    def get(self, request):
        paginator = PageNumberPagination()
        paginator.page_size = request.GET.get('page_size', 10)

        search_query = request.GET.get('search', '')
        queryset = StationEntitiesMaster.objects.all()

        if search_query:
            queryset = queryset.filter(
                Q(entityname__icontains=search_query) |
                Q(entitydesc__icontains=search_query) |
                Q(station__stationname__icontains=search_query)
            )

        result_page = paginator.paginate_queryset(queryset, request)
        serializer = StationEntitiesMasterSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = StationEntitiesMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StationEntitiesMasterDetailAPIView(APIView):
    """
    GET: Retrieve a station entity
    PUT: Update a station entity
    DELETE: Delete a station entity
    """
    def get_object(self, pk):
        try:
            return StationEntitiesMaster.objects.get(pk=pk)
        except StationEntitiesMaster.DoesNotExist:
            return None

    def get(self, request, pk):
        entity = self.get_object(pk)
        if not entity:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = StationEntitiesMasterSerializer(entity)
        return Response(serializer.data)

    def put(self, request, pk):
        entity = self.get_object(pk)
        if not entity:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = StationEntitiesMasterSerializer(entity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        entity = self.get_object(pk)
        if not entity:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        entity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)