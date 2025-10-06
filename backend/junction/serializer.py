from rest_framework import serializers
from junction.models import junctionboxmaster,Logicalassetmaster
from Location.models import StationEntitiesMaster


class JunctionBoxMasterSerializer(serializers.ModelSerializer):

    stationentity=serializers.CharField(source="stationentity.entityname", read_only=True)
    stationentity = serializers.PrimaryKeyRelatedField(
        queryset=StationEntitiesMaster.objects.all()
    )
    class Meta:
        model = junctionboxmaster
        fields = '__all__'


class LogicalassetmasterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Logicalassetmaster
        fields = '__all__'
        

