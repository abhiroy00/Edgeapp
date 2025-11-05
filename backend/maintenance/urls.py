from django.urls import path
from .views import (
    TaskMasterAPIView,
    TypeMasterAPIView,
    StatusMasterAPIView
)

urlpatterns = [
    # 🔹 Task Master
    path('taskmaster/', TaskMasterAPIView.as_view(), name='taskmaster-list-create'),
    path('taskmaster/<int:pk>/', TaskMasterAPIView.as_view(), name='taskmaster-detail'),

    # 🔹 Type Master
    path('typemaster/', TypeMasterAPIView.as_view(), name='typemaster-list-create'),
    path('typemaster/<int:pk>/', TypeMasterAPIView.as_view(), name='typemaster-detail'),

    # 🔹 Status Master
    path('statusmaster/', StatusMasterAPIView.as_view(), name='statusmaster-list-create'),
    path('statusmaster/<int:pk>/', StatusMasterAPIView.as_view(), name='statusmaster-detail'),
]
