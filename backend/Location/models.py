from django.db import models

class ZoneMaster(models.Model):
    zoneid = models.AutoField(primary_key=True)  # auto-increment ID
    zonename = models.CharField(max_length=100, null=False)  
    zonedesc = models.TextField(blank=True, null=True)  
    prefixcode = models.CharField(max_length=20, null=False)  
    is_active = models.BooleanField(default=True)  

    def __str__(self):
        return self.zonename
    

class DivisionMaster(models.Model):
    divisionid = models.AutoField(primary_key=True)
    divisionname = models.CharField(max_length=255, null=False)
    divisiondesc = models.TextField(blank=True, null=True)
    
    # Many divisions can belong to one zone
    zone = models.ForeignKey(ZoneMaster, on_delete=models.CASCADE, related_name="divisions")  
    
    prefixcode = models.CharField(max_length=20, null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.divisionname} ({self.zone.zonename})"

class StationMaster(models.Model):
    stationid=models.AutoField(primary_key=True)
    stationname=models.CharField(max_length=200,null=False)
    stationdesc=models.TextField(blank=True,null=True)
    division = models.ForeignKey(DivisionMaster, on_delete=models.CASCADE, related_name="stations")
    prefixcode = models.CharField(max_length=20, null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.stationname}"

class StationEntitiesMaster(models.Model):
    entityid=models.AutoField(primary_key=True)
    entityname=models.CharField(max_length=200,null=False)
    entitydesc=models.TextField(blank=True,null=True)
    station=models.ForeignKey(StationMaster,on_delete=models.CASCADE,related_name="entities")
    prefixcode = models.CharField(max_length=20, null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.entityid}"






