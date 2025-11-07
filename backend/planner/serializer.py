from rest_framework import serializers
from .models import ScheduleCreation
from maintenance.models import TaskMaster, TypeMaster, StatusMaster
from users.models import UserMaster

class ScheduleCreationSerializer(serializers.ModelSerializer):
    task_name = serializers.CharField(source='task.taskname', read_only=True)
    maintenancetype_name = serializers.CharField(source='maintenancetype.maintenancetypename', read_only=True)
    status_name = serializers.CharField(source='status.statusname', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    task = serializers.PrimaryKeyRelatedField(queryset=TaskMaster.objects.all())
    maintenancetype = serializers.PrimaryKeyRelatedField(queryset=TypeMaster.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=StatusMaster.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=UserMaster.objects.all())

    class Meta:
        model = ScheduleCreation
        fields = '__all__'