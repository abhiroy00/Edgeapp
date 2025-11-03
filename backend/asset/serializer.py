from rest_framework import serializers
from asset.models import AssetMaster,AssetInventory,AssetAttributeMaster,OperatorMaster,AlarmCreation,AssestAttributelink
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

class OperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorMaster
        fields = '__all__'

class AlarmCreationSerializer(serializers.ModelSerializer):
    assetattributelink=serializers.PrimaryKeyRelatedField(queryset=AssestAttributelink.objects.all())
    mathoperator = serializers.PrimaryKeyRelatedField(queryset=OperatorMaster.objects.all())
    class Meta:
        model = AlarmCreation
        fields = '__all__'