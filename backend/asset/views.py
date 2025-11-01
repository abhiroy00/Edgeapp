from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.db.models import Q

from .models import AssetMaster, AssetInventory,AssetAttributeMaster
from asset.serializer import AssetMasterSerializer, AssetInventorySerializer,AssetAttributeMasterSerializer


class AssetMasterView(APIView):
    # ✅ GET (List + Search + Pagination)
    def get(self, request):
        search = request.GET.get('search', "")
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))

        queryset = AssetMaster.objects.all()

        # ✅ Search filtering
        if search:
            queryset = queryset.filter(
                Q(assetname__icontains=search) |
                Q(assetprefix__icontains=search)
            )

        # ✅ Pagination
        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)

        serializer = AssetMasterSerializer(page_obj, many=True)

        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    # ✅ POST (Create)
    def post(self, request):
        serializer = AssetMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Asset created", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssetDetailsView(APIView):
    # ✅ GET (Single Item)
    def get(self, request, id):
        try:
            asset = AssetMaster.objects.get(assetid=id)
        except AssetMaster.DoesNotExist:
            return Response({"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssetMasterSerializer(asset)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ PUT (Update)
    def put(self, request, id):
        try:
            asset = AssetMaster.objects.get(assetid=id)
        except AssetMaster.DoesNotExist:
            return Response({"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssetMasterSerializer(asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ✅ DELETE
    def delete(self, request, id):
        try:
            asset = AssetMaster.objects.get(assetid=id)
        except AssetMaster.DoesNotExist:
            return Response({"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND)

        asset.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)


class AssetInventoryAPIView(APIView):
    """
    API View for AssetInventory CRUD with Search and Pagination
    """

    def get(self, request, pk=None):
        """
        GET Method:
        - If pk provided → return single record
        - Else → return paginated + searchable list
        """
        if pk:
            # Single record
            try:
                asset = AssetInventory.objects.get(pk=pk)
                serializer = AssetInventorySerializer(asset)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except AssetInventory.DoesNotExist:
                return Response({"error": "AssetInventory not found"}, status=status.HTTP_404_NOT_FOUND)

        # --- List with Search + Pagination ---
        search_query = request.GET.get("search", "")
        page_number = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 10))

        # Searchable fields
        queryset = AssetInventory.objects.all().order_by("-assetinventoryid")

        if search_query:
            queryset = queryset.filter(
                Q(manufacturermodel__icontains=search_query)
                | Q(serialnumber__icontains=search_query)
                | Q(railwaycode__icontains=search_query)
                | Q(isRDPMSasset__icontains=search_query)
            )

        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page_number)

        serializer = AssetInventorySerializer(page_obj, many=True)

        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        """
        POST Method: Create new AssetInventory record
        """
        serializer = AssetInventorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        """
        PUT Method: Full update of existing record
        """
        if not pk:
            return Response({"error": "ID (pk) required for update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            asset = AssetInventory.objects.get(pk=pk)
        except AssetInventory.DoesNotExist:
            return Response({"error": "AssetInventory not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssetInventorySerializer(asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        """
        PATCH Method: Partial update
        """
        if not pk:
            return Response({"error": "ID (pk) required for partial update"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            asset = AssetInventory.objects.get(pk=pk)
        except AssetInventory.DoesNotExist:
            return Response({"error": "AssetInventory not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssetInventorySerializer(asset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        """
        DELETE Method: Delete record by ID
        """
        if not pk:
            return Response({"error": "ID (pk) required for delete"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            asset = AssetInventory.objects.get(pk=pk)
        except AssetInventory.DoesNotExist:
            return Response({"error": "AssetInventory not found"}, status=status.HTTP_404_NOT_FOUND)

        asset.delete()
        return Response({"message": "AssetInventory deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class AssetAttributeMasterAPIView(APIView):

    def get(self, request, *args, **kwargs):
        search = request.GET.get("search", "")
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("pageSize", 10))

        queryset = AssetAttributeMaster.objects.filter(
            Q(name__icontains=search)
        ).order_by("-assetattributemasterid")

        paginator = Paginator(queryset, page_size)
        paginated_data = paginator.get_page(page)

        serializer = AssetAttributeMasterSerializer(paginated_data, many=True)

        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "next": paginated_data.next_page_number() if paginated_data.has_next() else None,
            "previous": paginated_data.previous_page_number() if paginated_data.has_previous() else None,
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = AssetAttributeMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Created Successfully", "data": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, *args, **kwargs):
        asset_attribute_id = request.data.get("assetattributemasterid")
        if not asset_attribute_id:
            return Response({"error": "assetattributemasterid is required"}, status=400)

        try:
            instance = AssetAttributeMaster.objects.get(assetattributemasterid=asset_attribute_id)
        except AssetAttributeMaster.DoesNotExist:
            return Response({"error": "Record not found"}, status=404)

        serializer = AssetAttributeMasterSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated successfully", "data": serializer.data})
        return Response(serializer.errors, status=400)

    def delete(self, request, *args, **kwargs):
        asset_attribute_id = request.GET.get("assetattributemasterid")
        if not asset_attribute_id:
            return Response({"error": "assetattributemasterid is required"}, status=400)

        try:
            instance = AssetAttributeMaster.objects.get(assetattributemasterid=asset_attribute_id)
        except AssetAttributeMaster.DoesNotExist:
            return Response({"error": "Record not found"}, status=404)

        instance.delete()
        return Response({"message": "Deleted successfully"}, status=200)