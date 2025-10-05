# urls.py
from django.urls import path
from .views import (UserTypeMasterAPIView,
                    UserRoleMasterAPIView,
                    UserProtectedEntityAPIView,
                    UserRolePermissionMapView,
                    UserLevelMasterView,
                    UserMasterView
                    )

urlpatterns = [
    path("usertypes/", UserTypeMasterAPIView.as_view(), name="usertype-list-create"),
    path("usertypes/<int:typeid>/", UserTypeMasterAPIView.as_view(), name="usertype-detail"),
    path("roles/", UserRoleMasterAPIView.as_view()),          
    path("roles/<int:pk>/", UserRoleMasterAPIView.as_view()),
    path('protected-entities/', UserProtectedEntityAPIView.as_view()),         
    path('protected-entities/<int:pk>/', UserProtectedEntityAPIView.as_view()),
    path("role-permissions/", UserRolePermissionMapView.as_view()),  # list + create
    path("role-permissions/<int:pk>/", UserRolePermissionMapView.as_view()),
    path("userlevels/", UserLevelMasterView.as_view()),              # list + create
    path("userlevels/<int:pk>/", UserLevelMasterView.as_view()),
     path("users/", UserMasterView.as_view()),          # list + create
    path("users/<int:pk>/", UserMasterView.as_view()),
  

]
