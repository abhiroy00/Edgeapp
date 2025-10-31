from rest_framework import serializers
from asset.models import AssetMaster,AssetInventory
from junction.models import junctionboxmaster

class AssetMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssetMaster
        fields='__all__'


class AssetInventorySerializer(serializers.ModelSerializer):
    junctionid = serializers.PrimaryKeyRelatedField(queryset=junctionboxmaster.objects.all())
    class Meta:
        model = AssetInventory
        fields = '__all__'