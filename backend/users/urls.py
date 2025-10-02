# urls.py
from django.urls import path
from .views import UserTypeMasterAPIView

urlpatterns = [
    path("usertypes/", UserTypeMasterAPIView.as_view(), name="usertype-list-create"),
    path("usertypes/<int:typeid>/", UserTypeMasterAPIView.as_view(), name="usertype-detail"),
]
