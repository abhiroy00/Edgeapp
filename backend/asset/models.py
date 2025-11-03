from django.db import models
from junction.models import junctionboxmaster
from Location.models import StationEntitiesMaster
from junction.models import Unitofmeasurementmaster
# Create your models here.

class AssetMaster(models.Model):
    assetid=models.AutoField(primary_key=True)
    assetname=models.CharField(max_length=200)
    asssetprefix=models.CharField(max_length=200)
    assetstatus=models.CharField(max_length=300)

    def __str__(self):
        return f"{self.assetid}"
    
class AssetInventory(models.Model):
    assetinventoryid=models.AutoField(primary_key=True)
    assetid=models.ForeignKey(AssetMaster,on_delete=models.CASCADE,related_name='assetmaster')
    junctionid=models.ForeignKey(junctionboxmaster,on_delete=models.CASCADE,related_name='junctionboxmaster')
    manufacturermodel=models.CharField(max_length=200)
    manufactureddate=models.DateField()
    manufactureyear=models.IntegerField()
    serialnumber=models.CharField(max_length=200)
    lattitude=models.CharField(max_length=200)
    longitude=models.CharField(max_length=200)
    railwaycode=models.CharField(max_length=200)
    isRDPMSasset=models.CharField(max_length=200)


    def __str__(self):
        return f"{self.assetinventoryid}"
    
class AssetAttributeMaster(models.Model):
    assetattributemasterid=models.AutoField(primary_key=True)
    asset=models.ForeignKey(AssetMaster,on_delete=models.CASCADE,related_name='assetattributemaster')
    name=models.CharField(max_length=200)
    unitofmeasurementmaster=models.ForeignKey(Unitofmeasurementmaster,on_delete=models.CASCADE,related_name='unitofmeasurementmaster')
    
class AssestAttributelink(models.Model):
   assetattributelink=models.AutoField(primary_key=True)
   assetinventory=models.ForeignKey(AssetInventory,on_delete=models.CASCADE,related_name='assetinventory')
   assetattributemaster=models.ForeignKey(AssetAttributeMaster,on_delete=models.CASCADE,related_name='assetattributemaster')
   sensorserial=models.TextField()
   sensorvalue=models.IntegerField()
   conversion=models.FloatField()
   portnumber=models.CharField(max_length=200)
   testpoint=models.CharField(max_length=200)
   testpointlocation=models.CharField(max_length=200)
   pulsevalue=models.FloatField()
   lolimit=models.IntegerField()
   hilimit=models.IntegerField()
   chnagethreshold_percentage=models.FloatField()
   datacollectionfrequency_minutes=models.IntegerField()
   wireferrrules=models.CharField(max_length=200)
   activewindowhours=models.CharField(max_length=200)
   isdashboardattribute=models.IntegerField()
   colorcondition=models.CharField(max_length=200)

class OperatorMaster(models.Model):
    mathoperator=models.AutoField(primary_key=True)
    operator=models.TextField()
    mathexpression=models.TextField()


class AlarmCreation(models.Model):
    alarmsetup=models.AutoField(primary_key=True)
    assetattributelink=models.ForeignKey(AssestAttributelink,on_delete=models.CASCADE,related_name='alarm_links')
    mathoperator=models.ForeignKey(OperatorMaster,on_delete=models.CASCADE,related_name='operatormaster')
    thresholdvalue=models.FloatField()
    message=models.TextField()
    actiontext=models.TextField()
    alerttolevel=models.IntegerField()
    repeat=models.IntegerField()
    duration_seconds=models.IntegerField()
    is_active=models.BooleanField(default=True)


    