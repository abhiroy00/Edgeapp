from rest_framework import serializers
from asset.models import AssetMaster,AssetInventory
from junction.models import junctionboxmaster
from Location.models import unitofmeasurementmaster

class AssetMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssetMaster
        fields='__all__'


class AssetInventorySerializer(serializers.ModelSerializer):
    junctionid = serializers.PrimaryKeyRelatedField(queryset=junctionboxmaster.objects.all())
    class Meta:
        model = AssetInventory
        fields = '__all__'
        

class AssetInventoryDetailSerializer(serializers.ModelSerializer):
    unitofmeasurementmasterid = serializers.PrimaryKeyRelatedField(queryset=unitofmeasurementmaster.objects.all())
    class Meta:
        model = AssetInventory
        fields = '__all__'