# models.py - FIXED VERSION

from django.db import models
from django.utils import timezone
from datetime import date
from asset.models import AssetInventory
from junction.models import Severitymaster
from users.models import UserMaster



class TypeMaster(models.Model):
    rid = models.AutoField(primary_key=True)
    maintenancetypename = models.CharField(max_length=200)
   
    def __str__(self):
        return f"{self.maintenancetypename}"
   

class StatusMaster(models.Model):
    sid = models.AutoField(primary_key=True)
    statusText = models.CharField(max_length=200)
   
    def __str__(self):
        return f"{self.sid}"


class TaskMaster(models.Model):
    user = models.ForeignKey(UserMaster, on_delete=models.CASCADE, null=True, blank=True)
    machinename = models.CharField(max_length=255, null=True, blank=True)
    taskmaster = models.AutoField(primary_key=True)
    physicalasset = models.ForeignKey(AssetInventory, on_delete=models.CASCADE, related_name='asset_inventory')
    taskname = models.CharField(max_length=200)
    frequency_days = models.IntegerField()
    severity = models.ForeignKey(Severitymaster, on_delete=models.CASCADE, related_name='severitymaster')
    schedulelimitdate = models.DateField()
    isBlockrequired = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.taskname} - {self.machinename}"
    
   

class TaskAssignment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]

    taskassignmentid = models.AutoField(primary_key=True)
    taskmaster = models.ForeignKey(TaskMaster, on_delete=models.CASCADE, related_name='assignments')
    task_number = models.IntegerField()  # Task #1, Task #2, etc.
    scheduled_date = models.DateField()  # When the task should be done
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    completed_date = models.DateField(null=True, blank=True)  # When it was actually completed
    assigned_to = models.ForeignKey(UserMaster, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['taskmaster', 'task_number']
        ordering = ['scheduled_date', 'task_number']

    def __str__(self):
        return f"{self.taskmaster.taskname} - Task #{self.task_number}"

    def save(self, *args, **kwargs):
        # FIXED: Use Python's date.today() instead of models.functions.Now()
        today = date.today()
        
        # Auto-update status based on completion
        if self.completed_date:
            self.status = 'completed'
        elif self.scheduled_date < today and not self.completed_date:
            self.status = 'overdue'
        else:
            self.status = 'pending'
        
        super().save(*args, **kwargs)

class TaskCloser(models.Model):
    scheduled_date = models.DateField()
    machinename = models.CharField(max_length=255, null=True, blank=True)
    task =models.ForeignKey(TaskMaster, on_delete=models.CASCADE)
    user = models.ForeignKey(UserMaster, on_delete=models.CASCADE, null=True, blank=True)
    isBlockrequired = models.IntegerField()
    
    def  __str__(self):
        return f"{self.scheduled_date}"
    
class MaintenanceFeedback(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    startdate = models.DateField()
    time=models.TimeField()

    def __str__(self):
        return f"{self.startdate} - {self.time}"
    


class TaskCompletion(models.Model):
    # Reference to the task assignment
    task_assignment_id = models.IntegerField()
    task_number = models.IntegerField()
    taskmaster = models.IntegerField()
    taskname = models.CharField(max_length=255)
    asset_id = models.IntegerField()
    
    # User assignment
    assigned_user = models.IntegerField(null=True, blank=True)
    
    # Dates
    scheduled_date = models.DateField()
    completed_date = models.DateField()
    
    # Maintenance time tracking
    maintenance_start_time = models.TimeField()
    maintenance_stop_time = models.TimeField()
    start_time_display = models.CharField(max_length=20)  # "02:30 PM"
    stop_time_display = models.CharField(max_length=20)   # "04:45 PM"
    duration = models.CharField(max_length=20)            # "2h 15m"
    
    # Task outcome
    is_successful = models.BooleanField(default=True)
    feedback = models.TextField()
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'task_completions'
        ordering = ['-completed_date', '-created_at']
        indexes = [
            models.Index(fields=['taskmaster', 'completed_date']),
            models.Index(fields=['task_assignment_id']),
            models.Index(fields=['assigned_user']),
        ]

    def __str__(self):
        return f"Task #{self.task_number} - {self.taskname} ({'Success' if self.is_successful else 'Failed'})"
    """Model to store task completion details with maintenance information"""
    
    # Task references
    task_assignment_id = models.IntegerField(
        help_text="Reference to the task assignment ID"
    )
    task_number = models.IntegerField(
        help_text="Task number for identification"
    )
    taskmaster = models.IntegerField(
        help_text="Task master ID"
    )
    taskname = models.CharField(
        max_length=255,
        help_text="Name of the task"
    )
    
    # Asset and user references (as IDs, not ForeignKeys)
    asset_id = models.IntegerField(
        null=True,
        blank=True,
        help_text="Asset ID reference"
    )
    assigned_user_id = models.IntegerField(
        null=True,
        blank=True,
        help_text="ID of user who completed the task"
    )
    
    # Date information
    scheduled_date = models.DateField(
        help_text="Original scheduled date"
    )
    completed_date = models.DateField(
        default=timezone.now,
        help_text="Date when task was completed"
    )
    
    # Time information (24-hour format)
    maintenance_start_time = models.TimeField(
        help_text="Maintenance start time in 24-hour format"
    )
    maintenance_stop_time = models.TimeField(
        help_text="Maintenance stop time in 24-hour format"
    )
    
    # Display format (12-hour format with AM/PM)
    start_time_display = models.CharField(
        max_length=20,
        help_text="Start time display format (e.g., 09:30 AM)"
    )
    stop_time_display = models.CharField(
        max_length=20,
        help_text="Stop time display format (e.g., 05:45 PM)"
    )
    
    # Duration
    duration = models.CharField(
        max_length=20,
        help_text="Duration of maintenance (e.g., 8h 15m)"
    )
    
    # Status and feedback
    is_successful = models.BooleanField(
        default=True,
        help_text="Whether the task was completed successfully"
    )
    feedback = models.TextField(
        help_text="Maintenance feedback and notes"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the record was last updated"
    )
    
    class Meta:
        db_table = 'task_completions'
        ordering = ['-completed_date', 'task_number']
        indexes = [
            models.Index(fields=['taskmaster']),
            models.Index(fields=['completed_date']),
            models.Index(fields=['assigned_user_id']),
            models.Index(fields=['task_assignment_id']),
            models.Index(fields=['is_successful']),
        ]
        verbose_name = 'Task Completion'
        verbose_name_plural = 'Task Completions'
    
    def __str__(self):
        return f"Task #{self.task_number} - {self.taskname} ({self.completed_date})"
    
    def save(self, *args, **kwargs):
        """Override save to calculate duration if not provided"""
        if not self.duration and self.maintenance_start_time and self.maintenance_stop_time:
            self.duration = self.calculate_duration()
        super().save(*args, **kwargs)
    
    def calculate_duration(self):
        """Calculate duration between start and stop times"""
        from datetime import datetime, timedelta
        
        start = datetime.combine(datetime.today(), self.maintenance_start_time)
        stop = datetime.combine(datetime.today(), self.maintenance_stop_time)
        
        # Handle overnight maintenance
        if stop < start:
            stop += timedelta(days=1)
        
        diff = stop - start
        hours = diff.seconds // 3600
        minutes = (diff.seconds % 3600) // 60
        
        return f"{hours}h {minutes}m"