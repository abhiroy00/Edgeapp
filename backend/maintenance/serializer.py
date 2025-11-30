from rest_framework import serializers
from maintenance.models import TaskAssignment,TypeMaster,StatusMaster,TaskMaster
from asset.models import AssetInventory
from junction.models import Severitymaster
from users.models import UserMaster
from maintenance.models import TaskCloser, MaintenanceFeedback


class TypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeMaster
        fields = '__all__'

class StatusMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusMaster
        fields = '__all__'


class TaskAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAssignment
        fields = '__all__'


class TaskMasterSerializer(serializers.ModelSerializer):
    assignments = TaskAssignmentSerializer(many=True, read_only=True)
    assignment_count = serializers.SerializerMethodField()
    completed_count = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(
        queryset=UserMaster.objects.all(),
        required=False,  # Add this
        allow_null=True  # Add this
    )
    
    class Meta:
        model = TaskMaster
        fields = '__all__'
    
    def get_assignment_count(self, obj):
        return obj.assignments.count()
    
    def get_completed_count(self, obj):
        return obj.assignments.filter(status='completed').count()
    
class TaskCloserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCloser
        fields = '__all__'

class MaintenanceFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCloser
        fields = '__all__'