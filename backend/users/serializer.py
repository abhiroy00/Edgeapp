from rest_framework import serializers
from users.models import UserTypeMaster


class UserTypeMasterSeriallizer(serializers.ModelSerializer):
    class Meta:
        model=UserTypeMaster
        fields = '__all__'
        