# urls.py
from django.urls import path
from .views import UserTypeMasterAPIView,UserRoleMasterAPIView

urlpatterns = [
    path("usertypes/", UserTypeMasterAPIView.as_view(), name="usertype-list-create"),
    path("usertypes/<int:typeid>/", UserTypeMasterAPIView.as_view(), name="usertype-detail"),
    path("roles/", UserRoleMasterAPIView.as_view()),          # list + create
    path("roles/<int:pk>/", UserRoleMasterAPIView.as_view()), # retrieve + update + delete
]
