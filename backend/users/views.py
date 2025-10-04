# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from users.models import (UserTypeMaster,
                          UserRoleMaster,
                          UserProtectedEntityMaster,
                          UserRolePermissionMap,
                          UserLevelMaster,
                          UserMaster
                          )
from users.serializer import (UserTypeMasterSeriallizer,
                              RoleMasterSerilallizer,
                              UserProtectedSerializer,
                              UserRolePermissionMapSerializer,
                              UserLevelMasterSerializer,
                              UserMasterSerializer
                              )


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
    


class UserRolePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50


class UserRoleMasterAPIView(APIView):
    pagination_class = UserRolePagination

    def get(self, request, pk=None):
        """
        GET:
        - List all roles with pagination and search
        - Get single role by pk
        """
        if pk:  # Single record fetch
            try:
                role = UserRoleMaster.objects.get(pk=pk)
                serializer = RoleMasterSerilallizer(role)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserRoleMaster.DoesNotExist:
                return Response({"error": "Role not found"}, status=status.HTTP_404_NOT_FOUND)

        # Search support
        queryset = UserRoleMaster.objects.all().order_by("roleid")
        search_query = request.GET.get("search")
        if search_query:
            queryset = queryset.filter(
                Q(rolename__icontains=search_query) | Q(roledesc__icontains=search_query)
            )

        # Pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = RoleMasterSerilallizer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        """
        Create new role
        """
        serializer = RoleMasterSerilallizer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update role by pk
        """
        try:
            role = UserRoleMaster.objects.get(pk=pk)
        except UserRoleMaster.DoesNotExist:
            return Response({"error": "Role not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RoleMasterSerilallizer(role, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete role by pk
        """
        try:
            role = UserRoleMaster.objects.get(pk=pk)
        except UserRoleMaster.DoesNotExist:
            return Response({"error": "Role not found"}, status=status.HTTP_404_NOT_FOUND)

        role.delete()
        return Response({"message": "Role deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    


class UserProtectedPagination(PageNumberPagination):
    page_size = 5                # default page size
    page_size_query_param = "page_size"
    max_page_size = 100


class UserProtectedEntityAPIView(APIView):
    pagination_class = UserProtectedPagination

    # GET with pagination + search
    def get(self, request, pk=None):
        if pk:  # single record fetch
            try:
                entity = UserProtectedEntityMaster.objects.get(pk=pk)
                serializer = UserProtectedSerializer(entity)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserProtectedEntityMaster.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # search query param
        search = request.GET.get("search", "")
        queryset = UserProtectedEntityMaster.objects.all()

        if search:
            queryset = queryset.filter(
                Q(pename__icontains=search)
            )

        # pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserProtectedSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # POST (create)
    def post(self, request):
        serializer = UserProtectedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT (update)
    def put(self, request, pk):
        try:
            entity = UserProtectedEntityMaster.objects.get(pk=pk)
        except UserProtectedEntityMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProtectedSerializer(entity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        try:
            entity = UserProtectedEntityMaster.objects.get(pk=pk)
            entity.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserProtectedEntityMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)



class UserRolePermissionMapPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserRolePermissionMapView(APIView):


    pagination_class = UserRolePermissionMapPagination

    # GET: list with search & pagination OR retrieve single
    def get(self, request, pk=None):
        if pk:
            try:
                perm = UserRolePermissionMap.objects.get(pk=pk)
                serializer = UserRolePermissionMapSerializer(perm)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserRolePermissionMap.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # search
        search = request.query_params.get("search", "")
        queryset = UserRolePermissionMap.objects.all()
        if search:
            queryset = queryset.filter(
                Q(role__rolename__icontains=search) | 
                Q(protectedentity__pename__icontains=search)
            )

        # pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserRolePermissionMapSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # POST: create new permission mapping
    def post(self, request):
        serializer = UserRolePermissionMapSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT: full update
    def put(self, request, pk):
        try:
            perm = UserRolePermissionMap.objects.get(pk=pk)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRolePermissionMapSerializer(perm, data=request.data)  # full update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: partial update
    def patch(self, request, pk):
        try:
            perm = UserRolePermissionMap.objects.get(pk=pk)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRolePermissionMapSerializer(perm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        try:
            perm = UserRolePermissionMap.objects.get(pk=pk)
            perm.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    pagination_class = UserRolePermissionMapPagination

    # 🔹 GET (List with Search + Pagination)
    def get(self, request, pk=None):
        if pk:  # single record
            try:
                instance = UserRolePermissionMap.objects.get(pk=pk)
                serializer = UserRolePermissionMapSerializer(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserRolePermissionMap.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # 🔍 Search filter
        search_query = request.query_params.get('search', '')
        queryset = UserRolePermissionMap.objects.all()

        if search_query:
            queryset = queryset.filter(
                Q(role__rolename__icontains=search_query) |
                Q(protectedentity__pename__icontains=search_query)
            )

        # 📄 Pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserRolePermissionMapSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # 🔹 POST (Create)
    def post(self, request):
        serializer = UserRolePermissionMapSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 PUT (Update Full)
    def put(self, request, pk):
        try:
            instance = UserRolePermissionMap.objects.get(pk=pk)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRolePermissionMapSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 PATCH (Update Partial)
    def patch(self, request, pk):
        try:
            instance = UserRolePermissionMap.objects.get(pk=pk)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRolePermissionMapSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 DELETE
    def delete(self, request, pk):
        try:
            instance = UserRolePermissionMap.objects.get(pk=pk)
            instance.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    pagination_class = UserRolePermissionMapPagination

    # GET: list with search & pagination or retrieve single
    def get(self, request, pk=None):
        if pk:
            try:
                perm = UserRolePermissionMap.objects.get(pk=pk)
                serializer = UserRolePermissionMapSerializer(perm)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserRolePermissionMap.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # search
        search = request.GET.get("search", "")
        queryset = UserRolePermissionMap.objects.all()
        if search:
            queryset = queryset.filter(
                Q(role__rolename__icontains=search) | 
                Q(protectedentity__pename__icontains=search)
            )

        # pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserRolePermissionMapSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # POST: create new permission mapping
    def post(self, request):
        serializer = UserRolePermissionMapSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT/PATCH: update
    def put(self, request, pk):
        try:
            perm = UserRolePermissionMap.objects.get(pk=pk)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRolePermissionMapSerializer(perm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        try:
            perm = UserRolePermissionMap.objects.get(pk=pk)
            perm.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserRolePermissionMap.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        




class UserLevelMasterPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# 🔹 API View
class UserLevelMasterView(APIView):
    pagination_class = UserLevelMasterPagination

    # GET (List + Search + Pagination or Single Retrieve)
    def get(self, request, pk=None):
        if pk:  # Single record
            try:
                instance = UserLevelMaster.objects.get(pk=pk)
                serializer = UserLevelMasterSerializer(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserLevelMaster.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # Search support
        search_query = request.query_params.get("search", "")
        queryset = UserLevelMaster.objects.all()

        if search_query:
            queryset = queryset.filter(
                Q(levelname__icontains=search_query)
            )

        # Pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserLevelMasterSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # POST (Create)
    def post(self, request):
        serializer = UserLevelMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT (Full Update)
    def put(self, request, pk):
        try:
            instance = UserLevelMaster.objects.get(pk=pk)
        except UserLevelMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserLevelMasterSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH (Partial Update)
    def patch(self, request, pk):
        try:
            instance = UserLevelMaster.objects.get(pk=pk)
        except UserLevelMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserLevelMasterSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        try:
            instance = UserLevelMaster.objects.get(pk=pk)
            instance.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserLevelMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)




class UserMasterView(APIView):
    pagination_class = UserLevelMasterPagination

    # GET (list with search + pagination or single)
    def get(self, request, pk=None):
        if pk:
            try:
                instance = UserMaster.objects.get(pk=pk)
                serializer = UserMasterSerializer(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserMaster.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        search = request.query_params.get("search", "")
        queryset = UserMaster.objects.all()

        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(usermail__icontains=search) |
                Q(userdesignation__icontains=search)
            )

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserMasterSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # POST (create)
    def post(self, request):
        serializer = UserMasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT (full update)
    def put(self, request, pk):
        try:
            instance = UserMaster.objects.get(pk=pk)
        except UserMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserMasterSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH (partial update)
    def patch(self, request, pk):
        try:
            instance = UserMaster.objects.get(pk=pk)
        except UserMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserMasterSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        try:
            instance = UserMaster.objects.get(pk=pk)
            instance.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserMaster.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)