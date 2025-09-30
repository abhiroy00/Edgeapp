
from django.urls import path
from Location.views import ZoneMasterListCreateAPIView,ZoneMasterDetailAPIView,DivisionMasterAPIView

urlpatterns = [
    path('zones/', ZoneMasterListCreateAPIView.as_view(), name='zone-list-create'),
    path('zones/<int:pk>/', ZoneMasterDetailAPIView.as_view(), name='zone-detail'),
    path('divisions/', DivisionMasterAPIView.as_view()),         
    path('divisions/<int:pk>/', DivisionMasterAPIView.as_view()),
 
]
