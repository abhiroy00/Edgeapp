# urls.py
from django.urls import path
from junction.views import (
    JunctionBoxMasterListCreateAPIView,
    JunctionBoxMasterDetailAPIView,
    LogicalassetmasterAPIView
)

urlpatterns = [
    path('junctionboxes/', JunctionBoxMasterListCreateAPIView.as_view(), name='junctionbox-list-create'),
    path('junctionboxes/<int:pk>/', JunctionBoxMasterDetailAPIView.as_view(), name='junctionbox-detail'),
     path('logicalassets/', LogicalassetmasterAPIView.as_view(), name='logicalasset-list'),
    path('logicalassets/<int:pk>/', LogicalassetmasterAPIView.as_view(), name='logicalasset-detail'),
]
