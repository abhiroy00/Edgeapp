from django.db import models

# Create your models here.

class AssetMaster(models.Model):
    assetid=models.AutoField(primary_key=True)
    assetname=models.CharField(max_length=200)
    asssetprefix=models.CharField(max_length=200)
    assetstatus=models.CharField(max_length=300)

    def __str__(self):
        return f"{self.assetid}"

