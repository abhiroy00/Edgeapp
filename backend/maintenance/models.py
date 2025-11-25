from django.db import models
from asset.models import AssetInventory
from junction.models import Severitymaster

# Create your models here.

class TaskMaster(models.Model):
    machinename = models.CharField(max_length=255, null=True, blank=True)
    taskmaster = models.AutoField(primary_key=True)
    physicalasset = models.ForeignKey(AssetInventory, on_delete=models.CASCADE, related_name='asset_inventory')
    taskname = models.CharField(max_length=200)
    frequency_days = models.IntegerField()
    severity = models.ForeignKey(Severitymaster, on_delete=models.CASCADE, related_name='severitymaster')
    schedulelimitdate = models.DateField()
    isBlockrequired=models.IntegerField()

    def __str__(self):
        return f"{self.taskmaster}"
    
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