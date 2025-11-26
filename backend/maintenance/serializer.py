from rest_framework import serializers
from maintenance.models import TaskAssignment,TypeMaster,StatusMaster,TaskMaster
from asset.models import AssetInventory
from junction.models import Severitymaster


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
    
    class Meta:
        model = TaskMaster
        fields = '__all__'
    
    def get_assignment_count(self, obj):
        return obj.assignments.count()
    
    def get_completed_count(self, obj):
        return obj.assignments.filter(status='completed').count()