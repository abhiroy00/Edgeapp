from rest_framework import serializers
from junction.models import junctionboxmaster
from Location.models import StationEntitiesMaster


class junctionboxmasterserializer(serializers.ModelSerializer):

    stationentity=serializers.PrimaryKeyRelatedField(queryset=StationEntitiesMaster.objects.all())
    class Meta:
        model = junctionboxmaster
        fields = '__all__'
