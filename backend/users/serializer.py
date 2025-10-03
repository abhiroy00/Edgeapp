from rest_framework import serializers
from users.models import (UserTypeMaster,
                          UserRoleMaster,
                          UserProtectedEntityMaster,
                          UserRolePermissionMap
                          )


class UserTypeMasterSeriallizer(serializers.ModelSerializer):
    class Meta:
        model=UserTypeMaster
        fields = '__all__'

class RoleMasterSerilallizer(serializers.ModelSerializer):
    roletype_name = serializers.CharField(source="roletype.typename", read_only=True)
    class Meta:
        model=UserRoleMaster
        fields='__all__'

class UserProtectedSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProtectedEntityMaster
        fields= '__all__'
        

class UserRolePermissionMapSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.rolename", read_only=True)
    entity_name = serializers.CharField(source="protectedentity.pename", read_only=True)

    class Meta:
        model = UserRolePermissionMap
        fields = '__all__'