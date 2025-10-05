from rest_framework import serializers
from junction.models import junctionboxmaster
from Location.models import StationEntitiesMaster


class JunctionBoxMasterSerializer(serializers.ModelSerializer):

    stationentity=serializers.CharField(source="stationentity.entityname", read_only=True)
    stationentity = serializers.PrimaryKeyRelatedField(
        queryset=StationEntitiesMaster.objects.all()
    )
    class Meta:
        model = junctionboxmaster
        fields = '__all__'
