from django.urls import path
from .views import (
    ScheduleCreationListCreateAPIView,
    ScheduleCreationDetailAPIView
)

urlpatterns = [
    path('schedule/', ScheduleCreationListCreateAPIView.as_view(), name='schedule-list'),
    path('schedule/<int:pk>/', ScheduleCreationDetailAPIView.as_view(), name='schedule-detail'),
]
