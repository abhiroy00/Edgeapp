from rest_framework import serializers
from users.models import (UserTypeMaster,
                          UserRoleMaster,
                          UserProtectedEntityMaster,
                          UserRolePermissionMap,
                          UserLevelMaster,
                          UserMaster
                          )
from Location.models import (DivisionMaster,
                             ZoneMaster,
                             StationMaster
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

class  UserLevelMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserLevelMaster
        fields='__all__'

class UserMasterSerializer(serializers.ModelSerializer):
    usertype_name = serializers.CharField(source="usertype.typename", read_only=True)
    userlevel_name = serializers.CharField(source="userlevel.levelname", read_only=True)
    userrole_name = serializers.CharField(source="userrole.rolename", read_only=True)
    zone_name = serializers.CharField(source="zone.zonename", read_only=True)
    division_name = serializers.CharField(source="division.divisionname", read_only=True)
    station_name = serializers.CharField(source="station.stationname", read_only=True)

    class Meta:
        model = UserMaster
        fields = '__all__'
