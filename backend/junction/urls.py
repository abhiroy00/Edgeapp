# urls.py
from django.urls import path
from junction.views import (
    JunctionBoxMasterListCreateAPIView,
    JunctionBoxMasterDetailAPIView
)

urlpatterns = [
    path('junctionboxes/', JunctionBoxMasterListCreateAPIView.as_view(), name='junctionbox-list-create'),
    path('junctionboxes/<int:pk>/', JunctionBoxMasterDetailAPIView.as_view(), name='junctionbox-detail'),
]
