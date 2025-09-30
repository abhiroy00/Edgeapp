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


