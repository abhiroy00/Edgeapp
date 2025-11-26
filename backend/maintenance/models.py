# models.py - FIXED VERSION

from django.db import models
from django.utils import timezone
from datetime import date
from asset.models import AssetInventory
from junction.models import Severitymaster
from users.models import UserMaster


class TaskMaster(models.Model):
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