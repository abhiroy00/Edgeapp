# urls.py
from django.urls import path
from junction.views import (
    JunctionBoxMasterListCreateAPIView,
    JunctionBoxMasterDetailAPIView,
    LogicalassetmasterAPIView,
    UnitofmeasurementmasterAPIView,
    SeveritymasterAPIView
)

urlpatterns = [
    path('junctionboxes/', JunctionBoxMasterListCreateAPIView.as_view(), name='junctionbox-list-create'),
    path('junctionboxes/<int:pk>/', JunctionBoxMasterDetailAPIView.as_view(), name='junctionbox-detail'),
    path('logicalassets/', LogicalassetmasterAPIView.as_view(), name='logicalasset-list'),
    path('logicalassets/<int:pk>/', LogicalassetmasterAPIView.as_view(), name='logicalasset-detail'),
    path('units/', UnitofmeasurementmasterAPIView.as_view(), name='unit-list'),
    path('units/<int:pk>/', UnitofmeasurementmasterAPIView.as_view(), name='unit-detail'),
    path('severities/', SeveritymasterAPIView.as_view(), name='severity-list'),
    path('severities/<int:pk>/', SeveritymasterAPIView.as_view(), name='severity-detail')
]
