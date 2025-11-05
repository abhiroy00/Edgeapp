from rest_framework import serializers
from maintenance.models import TaskMaster,TypeMaster,StatusMaster
from asset.models import AssetInventory
from junction.models import Severitymaster

class TaskMasterSerializer(serializers.ModelSerializer):
    physicalasset = serializers.PrimaryKeyRelatedField(queryset=AssetInventory.objects.all())
    severity = serializers.PrimaryKeyRelatedField(queryset=Severitymaster.objects.all())

    class Meta:
        model = TaskMaster
        fields = '__all__'

class TypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeMaster
        fields = '__all__'

class StatusMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusMaster
        fields = '__all__'