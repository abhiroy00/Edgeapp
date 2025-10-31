from django.db import models
from junction.models import junctionboxmaster

# Create your models here.

class AssetMaster(models.Model):
    assetid=models.AutoField(primary_key=True)
    assetname=models.CharField(max_length=200)
    asssetprefix=models.CharField(max_length=200)
    assetstatus=models.CharField(max_length=300)

    def __str__(self):
        return f"{self.assetid}"
    
class AsserInventory(models.Model):
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

