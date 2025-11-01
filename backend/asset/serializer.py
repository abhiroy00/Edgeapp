from rest_framework import serializers
from asset.models import AssetMaster,AssetInventory,AssetAttributeMaster
from junction.models import junctionboxmaster
from junction.models import Unitofmeasurementmaster

class AssetMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssetMaster
        fields='__all__'


class AssetInventorySerializer(serializers.ModelSerializer):
    junctionid = serializers.PrimaryKeyRelatedField(queryset=junctionboxmaster.objects.all())
    class Meta:
        model = AssetInventory
        fields = '__all__'
        

class AssetAttributeMasterSerializer(serializers.ModelSerializer):
    asset = serializers.PrimaryKeyRelatedField(queryset=AssetMaster.objects.all())
    unitofmeasurementmaster = serializers.PrimaryKeyRelatedField(queryset=Unitofmeasurementmaster.objects.all())

    class Meta:
        model = AssetAttributeMaster
        fields = '__all__'