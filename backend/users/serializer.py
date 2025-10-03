from rest_framework import serializers
from users.models import UserTypeMaster,UserRoleMaster


class UserTypeMasterSeriallizer(serializers.ModelSerializer):
    class Meta:
        model=UserTypeMaster
        fields = '__all__'

class RoleMasterSerilallizer(serializers.ModelSerializer):
    roletype_name = serializers.CharField(source="roletype.typename", read_only=True)
    class Meta:
        model=UserRoleMaster
        fields='__all__'
        
        