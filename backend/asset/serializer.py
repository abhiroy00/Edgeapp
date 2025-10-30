from rest_framework import serializers
from asset.models import AssetMaster

class AssetMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssetMaster
        fields='__all__'