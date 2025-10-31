from django.urls import path
from .views import AssetMasterView, AssetDetailsView,AssetInventoryAPIView

urlpatterns = [
    path('asset/', AssetMasterView.as_view()),             # List + Create
    path('asset/<int:id>/', AssetDetailsView.as_view()),
    path('assetinventory/', AssetInventoryAPIView.as_view(), name='assetinventory-list'),
    path('assetinventory/<int:pk>/', AssetInventoryAPIView.as_view(), name='assetinventory-detail'),
]
