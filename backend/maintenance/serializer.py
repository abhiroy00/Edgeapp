from rest_framework import serializers
from maintenance.models import TaskAssignment,TypeMaster,StatusMaster,TaskMaster
from asset.models import AssetInventory
from junction.models import Severitymaster
from users.models import UserMaster
from users.serializer import UserMasterSerializer
from maintenance.models import TaskCloser, MaintenanceFeedback,TaskCompletion


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
        model = MaintenanceFeedback
        fields = '__all__'




class TaskCompletionListSerializer(serializers.ModelSerializer):
    """Serializer for listing task completions with minimal data"""
    
    assigned_user_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TaskCompletion
        fields = [
            'id',
            'task_assignment',
            'task_number',
            'taskname',
            'assigned_user',
            'assigned_user_name',
            'scheduled_date',
            'completed_date',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'status_display',
            'feedback',
        ]
        read_only_fields = ['id', 'assigned_user_name', 'status_display']
    
    def get_assigned_user_name(self, obj):
        """Get the username of the assigned user"""
        if obj.assigned_user:
            return obj.assigned_user.username
        return "Not assigned"
    
    def get_status_display(self, obj):
        """Get human-readable status"""
        return "Success" if obj.is_successful else "Failed"


class TaskCompletionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for task completions with all information"""
    
    assigned_user_details = UserMasterSerializer(source='assigned_user', read_only=True)
    assigned_user_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    asset_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TaskCompletion
        fields = [
            'id',
            'task_assignment',
            'task_number',
            'taskmaster',
            'taskname',
            'asset',
            'asset_name',
            'assigned_user',
            'assigned_user_name',
            'assigned_user_details',
            'scheduled_date',
            'completed_date',
            'maintenance_start_time',
            'maintenance_stop_time',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'status_display',
            'feedback',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'assigned_user_name',
            'assigned_user_details',
            'status_display',
            'asset_name',
            'created_at',
            'updated_at'
        ]
    
    def get_assigned_user_name(self, obj):
        """Get the username of the assigned user"""
        if obj.assigned_user:
            return obj.assigned_user.username
        return "Not assigned"
    
    def get_status_display(self, obj):
        """Get human-readable status"""
        return "Success" if obj.is_successful else "Failed"
    
    def get_asset_name(self, obj):
        """Get the asset name"""
        if obj.asset:
            return getattr(obj.asset, 'asset_name', str(obj.asset))
        return None


class TaskCompletionListSerializer(serializers.ModelSerializer):
    """Serializer for listing task completions with minimal data"""
    
    assigned_user_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TaskCompletion
        fields = [
            'id',
            'task_assignment',
            'task_number',
            'taskname',
            'assigned_user',
            'assigned_user_name',
            'scheduled_date',
            'completed_date',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'status_display',
            'feedback',
        ]
        read_only_fields = ['id', 'assigned_user_name', 'status_display']
    
    def get_assigned_user_name(self, obj):
        """Get the username of the assigned user"""
        if obj.assigned_user:
            return obj.assigned_user.username
        return "Not assigned"
    
    def get_status_display(self, obj):
        """Get human-readable status"""
        return "Success" if obj.is_successful else "Failed"


class UserMasterSerializer(serializers.ModelSerializer):
    """Serializer for UserMaster information"""
    
    class Meta:
        model = UserMaster # Change this to your UserMaster model
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information"""
    
    class Meta:
        model = UserMaster
        fields = '__all__'
        read_only_fields = ['id']


class TaskCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCompletion
        fields = [
            'id',
            'task_assignment_id',
            'task_number',
            'taskmaster',
            'taskname',
            'asset_id',
            'assigned_user',
            'scheduled_date',
            'completed_date',
            'maintenance_start_time',
            'maintenance_stop_time',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'feedback',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    
class TaskCompletionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for task completions with all information"""
    
    assigned_user_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TaskCompletion
        fields = [
            'id',
            'task_assignment_id',
            'task_number',
            'taskmaster',
            'taskname',
            'asset_id',
            'assigned_user_id',
            'assigned_user_name',
            'scheduled_date',
            'completed_date',
            'maintenance_start_time',
            'maintenance_stop_time',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'status_display',
            'feedback',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'assigned_user_name',
            'status_display',
            'created_at',
            'updated_at'
        ]
    
    def get_assigned_user_name(self, obj):
        """Get the username of the assigned user"""
        if obj.assigned_user_id:
            return f"User #{obj.assigned_user_id}"
        return "Not assigned"
    
    def get_status_display(self, obj):
        """Get human-readable status"""
        return "Success" if obj.is_successful else "Failed"
    
    def get_assigned_user_name(self, obj):
        """Get the username of the assigned user"""
        if obj.assigned_user:
            return obj.assigned_user.username
        return "Not assigned"
    
    def get_status_display(self, obj):
        """Get human-readable status"""
        return "Success" if obj.is_successful else "Failed"


class TaskCompletionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating task completions"""
    
    class Meta:
        model = TaskCompletion
        fields = [
            'task_assignment_id',
            'task_number',
            'taskmaster',
            'taskname',
            'asset_id',
            'assigned_user_id',
            'scheduled_date',
            'completed_date',
            'maintenance_start_time',
            'maintenance_stop_time',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'feedback',
        ]
    
    def validate(self, data):
        """Validate the task completion data"""
        # Validate that stop time is after start time (or handle overnight)
        if data['maintenance_start_time'] and data['maintenance_stop_time']:
            # This is just a warning - overnight maintenance is allowed
            if data['maintenance_stop_time'] < data['maintenance_start_time']:
                # Could add a flag or log that this is overnight maintenance
                pass
        
        # Validate feedback is not empty
        if not data.get('feedback', '').strip():
            raise serializers.ValidationError({
                'feedback': 'Feedback cannot be empty'
            })
        
        return data
    
    def create(self, validated_data):
        """Create a new task completion record"""
        # Calculate duration if not provided
        if not validated_data.get('duration'):
            completion = TaskCompletion(**validated_data)
            validated_data['duration'] = completion.calculate_duration()
        
        return super().create(validated_data)


class TaskCompletionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating task completions"""
    
    class Meta:
        model = TaskCompletion
        fields = [
            'maintenance_start_time',
            'maintenance_stop_time',
            'start_time_display',
            'stop_time_display',
            'duration',
            'is_successful',
            'feedback',
            'completed_date',
        ]
    
    def validate(self, data):
        """Validate the update data"""
        if 'feedback' in data and not data['feedback'].strip():
            raise serializers.ValidationError({
                'feedback': 'Feedback cannot be empty'
            })
        
        return data
    
    def update(self, instance, validated_data):
        """Update the task completion record and recalculate duration if needed"""
        # If times are updated, recalculate duration
        if ('maintenance_start_time' in validated_data or 
            'maintenance_stop_time' in validated_data):
            instance.maintenance_start_time = validated_data.get(
                'maintenance_start_time', 
                instance.maintenance_start_time
            )
            instance.maintenance_stop_time = validated_data.get(
                'maintenance_stop_time',
                instance.maintenance_stop_time
            )
            validated_data['duration'] = instance.calculate_duration()
        
        return super().update(instance, validated_data)

