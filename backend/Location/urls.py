
from django.urls import path
from Location.views import (
ZoneMasterListCreateAPIView,
ZoneMasterDetailAPIView,
DivisionMasterAPIView,
StationMasterListCreateAPIView,
StationMasterDetailAPIView,
StationEntitiesMasterDetailAPIView,
StationEntitiesMasterListCreateAPIView
)

urlpatterns = [
    path('zones/', ZoneMasterListCreateAPIView.as_view(), name='zone-list-create'),
    path('zones/<int:pk>/', ZoneMasterDetailAPIView.as_view(), name='zone-detail'),
    path('divisions/', DivisionMasterAPIView.as_view()),         
    path('divisions/<int:pk>/', DivisionMasterAPIView.as_view()),
    path('stations/', StationMasterListCreateAPIView.as_view(), name='station-list-create'),
    path('stations/<int:pk>/', StationMasterDetailAPIView.as_view(), name='station-detail'),
    path('entities/', StationEntitiesMasterListCreateAPIView.as_view(), name='entity-list-create'),
    path('entities/<int:pk>/', StationEntitiesMasterDetailAPIView.as_view(), name='entity-detail'),
 
]
