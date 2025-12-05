from django.contrib import admin
from .models import TaskCompletion


@admin.register(TaskCompletion)
class TaskCompletionAdmin(admin.ModelAdmin):
    list_display = [
        'task_number',
        'taskname',
        'assigned_user_id',
        'completed_date',
        'duration',
        'is_successful',
        'created_at'
    ]
    list_filter = [
        'is_successful',
        'completed_date',
        'created_at'
    ]
    search_fields = [
        'task_number',
        'taskname',
        'feedback'
    ]
    readonly_fields = [
        'created_at',
        'updated_at'
    ]
    fieldsets = (
        ('Task Information', {
            'fields': (
                'task_assignment_id',
                'task_number',
                'taskmaster',
                'taskname',
                'asset_id',
                'assigned_user_id'
            )
        }),
        ('Date Information', {
            'fields': (
                'scheduled_date',
                'completed_date'
            )
        }),
        ('Time Information', {
            'fields': (
                'maintenance_start_time',
                'maintenance_stop_time',
                'start_time_display',
                'stop_time_display',
                'duration'
            )
        }),
        ('Completion Details', {
            'fields': (
                'is_successful',
                'feedback'
            )
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'updated_at'
            )
        }),
    )
    date_hierarchy = 'completed_date'
    ordering = ['-completed_date', 'task_number']