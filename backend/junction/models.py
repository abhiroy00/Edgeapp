from django.db import models
from Location.models import StationEntitiesMaster
# Create your models here.
class junctionboxmaster(models.Model):
    junctionid = models.AutoField(primary_key=True)
    junctionname = models.CharField(max_length=255, null=False)
    junctiondesc = models.TextField(blank=True, null=True)
    stationentity=models.ForeignKey(StationEntitiesMaster,on_delete=models.CASCADE,related_name="junctionboxmaster")
    prefixcode = models.CharField(max_length=20, null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.junctionname}"
    
    
class Logicalassetmaster(models.Model):
    logicalassetid = models.AutoField(primary_key=True)
    logicalassetname = models.TextField(blank=True, null=False)
    prefixcode = models.CharField(max_length=20, null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.logicalassetname}"
    
