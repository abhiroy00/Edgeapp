from django.shortcuts import render
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from junction.models import (junctionboxmaster,
                             Logicalassetmaster,
                             Unitofmeasurementmaster,
                             Severitymaster
                             )
from junction.serializer import (JunctionBoxMasterSerializer,
                                 LogicalassetmasterSerializer,
                                 UnitofmeasurementmasterSerializer,
                                 SeveritymasterSerializer
                                 )


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


# ✅ Custom Pagination
class LogicalAssetPagination(PageNumberPagination):
    page_size = 10  # default page size
    page_size_query_param = 'page_size'
    max_page_size = 100


# ✅ Logical Asset CRUD API
class LogicalassetmasterAPIView(APIView):
    pagination_class = LogicalAssetPagination

    def get(self, request, pk=None):
        if pk:
            # Fetch single asset
            logical_asset = get_object_or_404(Logicalassetmaster, pk=pk)
            serializer = LogicalassetmasterSerializer(logical_asset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Fetch all with pagination
            logical_assets = Logicalassetmaster.objects.all().order_by('logicalassetid')
            paginator = self.pagination_class()
            paginated_qs = paginator.paginate_queryset(logical_assets, request)
            serializer = LogicalassetmasterSerializer(paginated_qs, many=True)
            return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = LogicalassetmasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        logical_asset = get_object_or_404(Logicalassetmaster, pk=pk)
        serializer = LogicalassetmasterSerializer(logical_asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        logical_asset = get_object_or_404(Logicalassetmaster, pk=pk)
        logical_asset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ✅ Pagination class
class UnitPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ✅ CRUD + Search API
class UnitofmeasurementmasterAPIView(APIView):
    pagination_class = UnitPagination

    def get(self, request, pk=None):
        if pk:
            # Single record
            unit = get_object_or_404(Unitofmeasurementmaster, pk=pk)
            serializer = UnitofmeasurementmasterSerializer(unit)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 🔍 Search functionality
        search_query = request.GET.get('search', '').strip()

        queryset = Unitofmeasurementmaster.objects.all().order_by('uid')

        if search_query:
            queryset = queryset.filter(
                Q(unitmeasurename__icontains=search_query) |
                Q(abbrivation__icontains=search_query) |
                Q(sensortype__icontains=search_query)
            )

        # ✅ Pagination
        paginator = self.pagination_class()
        paginated_units = paginator.paginate_queryset(queryset, request)
        serializer = UnitofmeasurementmasterSerializer(paginated_units, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = UnitofmeasurementmasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        unit = get_object_or_404(Unitofmeasurementmaster, pk=pk)
        serializer = UnitofmeasurementmasterSerializer(unit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        unit = get_object_or_404(Unitofmeasurementmaster, pk=pk)
        unit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SeverityPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ✅ CRUD + Search API View
class SeveritymasterAPIView(APIView):
    pagination_class = SeverityPagination

    def get(self, request, pk=None):
        if pk:
            # Get single record
            severity = get_object_or_404(Severitymaster, pk=pk)
            serializer = SeveritymasterSerializer(severity)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 🔍 Search filter
        search_query = request.GET.get('search', '').strip()
        queryset = Severitymaster.objects.all().order_by('rid')

        if search_query:
            queryset = queryset.filter(Q(severitystring__icontains=search_query))

        # ✅ Pagination
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(queryset, request)
        serializer = SeveritymasterSerializer(paginated_data, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = SeveritymasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        severity = get_object_or_404(Severitymaster, pk=pk)
        serializer = SeveritymasterSerializer(severity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        severity = get_object_or_404(Severitymaster, pk=pk)
        severity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






