# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from users.models import UserTypeMaster
from users.serializer import UserTypeMasterSeriallizer


# ✅ Pagination class
class UserTypePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


# ✅ Single APIView handling list/create and retrieve/update/delete
class UserTypeMasterAPIView(APIView):
    def get_object(self, typeid):
        try:
            return UserTypeMaster.objects.get(typeid=typeid)
        except UserTypeMaster.DoesNotExist:
            return None

    def get(self, request, typeid=None):
        if typeid:
            # Retrieve single object
            obj = self.get_object(typeid)
            if not obj:
                return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserTypeMasterSeriallizer(obj)
            return Response(serializer.data)
        else:
            # List with pagination and search
            search_query = request.GET.get("search", "")
            queryset = UserTypeMaster.objects.all().order_by("typeid")
            if search_query:
                queryset = queryset.filter(Q(typename__icontains=search_query))
            paginator = UserTypePagination()
            page = paginator.paginate_queryset(queryset, request)
            serializer = UserTypeMasterSeriallizer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        # Create new object
        serializer = UserTypeMasterSeriallizer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, typeid):
        obj = self.get_object(typeid)
        if not obj:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserTypeMasterSeriallizer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, typeid):
        obj = self.get_object(typeid)
        if not obj:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
