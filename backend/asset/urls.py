from django.urls import path
from .views import (AssetMasterView, 
                    AssetDetailsView,
                    AssetInventoryAPIView,
                    AssetAttributeMasterAPIView,
                    OperatorMasterAPIView,
                    AlarmCreationAPIView,
                    AssestAttributelinkAPIView,
                    AssestAttributelinkDetailAPIView
                    )

urlpatterns = [
    path('asset/', AssetMasterView.as_view()),             # List + Create
    path('asset/<int:id>/', AssetDetailsView.as_view()),
    path('assetinventory/', AssetInventoryAPIView.as_view(), name='assetinventory-list'),
    path('assetinventory/<int:pk>/', AssetInventoryAPIView.as_view(), name='assetinventory-detail'),
    path("asset-attributes/", AssetAttributeMasterAPIView.as_view()),
    path('operator/', OperatorMasterAPIView.as_view(), name='operator-list'),
    path('operator/<int:pk>/', OperatorMasterAPIView.as_view(), name='operator-detail'),
    path('alarmcreation/', AlarmCreationAPIView.as_view(), name='alarmcreation-list'),
    path('alarmcreation/<int:pk>/', AlarmCreationAPIView.as_view(), name='alarmcreation-detail'),
    path('asset-attribute-link/', AssestAttributelinkAPIView.as_view()),
    path('asset-attribute-link/<int:pk>/', AssestAttributelinkDetailAPIView.as_view()),
]
