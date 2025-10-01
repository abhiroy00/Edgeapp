from rest_framework import serializers
from Location.models import ZoneMaster,DivisionMaster,StationMaster

class ZoneMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoneMaster
        fields = '__all__'

class DivisionMasterSerializer(serializers.ModelSerializer):
    # Accept zone ID in requests
    zone = serializers.PrimaryKeyRelatedField(queryset=ZoneMaster.objects.all())

    class Meta:
        model = DivisionMaster
        fields = '__all__'

class StationMasterSeriallizer(serializers.ModelSerializer):
    division=serializers.PrimaryKeyRelatedField(queryset=StationMaster.objects.all())

    class Meta:
        model= StationMaster
        fields='__all__'