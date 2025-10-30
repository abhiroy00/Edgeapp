from django.urls import path
from .views import AssetMasterView, AssetDetailsView

urlpatterns = [
    path('asset/', AssetMasterView.as_view()),             # List + Create
    path('asset/<int:id>/', AssetDetailsView.as_view()),   # Read + Update + Delete
]
