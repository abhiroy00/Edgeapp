from django.urls import path
from .views import (
    TaskMasterAPIView,
    GenerateScheduleAPIView,
    TaskAssignmentAPIView,
    MarkCompleteAPIView,
    MarkPendingAPIView,
    BulkCompleteAPIView,
    TypeMasterAPIView,
    StatusMasterAPIView,
    BulkAssignAPIView
)

urlpatterns = [
    # Task Master CRUD
    path('taskmaster/', TaskMasterAPIView.as_view()),
    path('taskmaster/<int:pk>/', TaskMasterAPIView.as_view()),

    # Generate schedule
    path('taskmaster/<int:pk>/generate_schedule/', GenerateScheduleAPIView.as_view()),

    # Task Assignment CRUD
    path('taskassignment/', TaskAssignmentAPIView.as_view()),
    path('taskassignment/<int:pk>/', TaskAssignmentAPIView.as_view()),

    # Status update operations
    path('taskassignment/<int:pk>/mark_complete/', MarkCompleteAPIView.as_view()),
    path('taskassignment/<int:pk>/mark_pending/', MarkPendingAPIView.as_view()),
    path('taskassignment/bulk_complete/', BulkCompleteAPIView.as_view()),
    path('taskassignment/bulk_complete/', BulkCompleteAPIView.as_view()),
    path('taskassignment/bulk_assign/', BulkAssignAPIView.as_view()),



    # Type & Status
    path('typemaster/', TypeMasterAPIView.as_view()),
    path('typemaster/<int:pk>/', TypeMasterAPIView.as_view()),
    path('statusmaster/', StatusMasterAPIView.as_view()),
    path('statusmaster/<int:pk>/', StatusMasterAPIView.as_view()),
]
