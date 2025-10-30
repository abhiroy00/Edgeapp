from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from django.db.models import Q

from .models import AssetMaster
from asset.serializer import AssetMasterSerializer

class AssetMasterView(APIView):
    # ✅ GET (List + Search + Pagination)
    def get(self, request):
        search = request.GET.get('search', "")
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)

        queryset = AssetMaster.objects.all()

        # ✅ Search filtering
        if search:
            queryset = queryset.filter(
                Q(assetname__icontains=search) |
                Q(asssetprefix__icontains=search)
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
        })

    # ✅ POST (Create)
    def post(self, request):
        serializer = AssetMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Asset created", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssetDetailsView(APIView):
    # ✅ GET (Single Item)
    def get(self, request, id):
        try:
            asset = AssetMaster.objects.get(assetid=id)
        except AssetMaster.DoesNotExist:
            return Response({"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssetMasterSerializer(asset)
        return Response(serializer.data)

    # ✅ PUT (Update)
    def put(self, request, id):
        try:
            asset = AssetMaster.objects.get(assetid=id)
        except AssetMaster.DoesNotExist:
            return Response({"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssetMasterSerializer(asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ✅ DELETE
    def delete(self, request, id):
        try:
            asset = AssetMaster.objects.get(assetid=id)
        except AssetMaster.DoesNotExist:
            return Response({"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND)

        asset.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)
