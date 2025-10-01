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

class StationMasterSerializer(serializers.ModelSerializer):
    # Correct: Division should point to DivisionMaster, not StationMaster
    division = serializers.PrimaryKeyRelatedField(queryset=DivisionMaster.objects.all())

    class Meta:
        model = StationMaster
        fields = '__all__'