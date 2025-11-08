from django.db import models
from Location.models import ZoneMaster,DivisionMaster,StationMaster

# Create your models here.
class UserTypeMaster(models.Model):
    typeid=models.AutoField(primary_key=True)
    typename=models.CharField(max_length=200,null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.typeid}"

class UserRoleMaster(models.Model):
    roleid=models.AutoField(primary_key=True)
    roletype=models.ForeignKey(UserTypeMaster,on_delete=models.CASCADE,related_name="userrolemaster")
    rolename=models.CharField(max_length=200,null=False)
    roledesc=models.TextField(blank=True,null=True)
    is_active = models.BooleanField(default=True) 

    def __str__(self):
        return f"{self.roleid}"
    
class UserProtectedEntityMaster(models.Model):
    peid=models.AutoField(primary_key=True)
    pename=models.CharField(max_length=200)

    def __str__(self):
        return f"{self.peid}"
    
class UserRolePermissionMap(models.Model):
    role = models.ForeignKey(UserRoleMaster, on_delete=models.CASCADE, related_name="userrolepermissionmap")
    protectedentity = models.ForeignKey(UserProtectedEntityMaster, on_delete=models.CASCADE, related_name="userperticted_master")
    canCreate = models.BooleanField(default=True)
    canRead = models.BooleanField(default=True)
    canUpdate = models.BooleanField(default=True)
    canDelete = models.BooleanField(default=True)
    canViewReport = models.BooleanField(default=True)
    canPrintReport = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

class UserLevelMaster(models.Model):
    levelid = models.AutoField(primary_key=True)
    levelname = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.levelname}" 

class UserMaster(models.Model):
    userid=models.AutoField(primary_key=True)
    usertype=models.ForeignKey(UserTypeMaster,on_delete=models.CASCADE,related_name="usermaster")
    userlevel=models.ForeignKey(UserLevelMaster,on_delete=models.CASCADE,related_name="userlevelmaster")
    userrole=models.ForeignKey(UserRoleMaster,on_delete=models.CASCADE,related_name="userrolemaster")
    username=models.CharField(max_length=200)
    userphone=models.CharField(max_length=20)
    usermail=models.EmailField()
    userdesignation=models.CharField(max_length=200)
    alertrecipient=models.IntegerField()
    zone=models.ForeignKey(ZoneMaster,on_delete=models.CASCADE,related_name="zonemaster")
    division=models.ForeignKey(DivisionMaster,on_delete=models.CASCADE,related_name="divisionmaster")
    station=models.ForeignKey(StationMaster,on_delete=models.CASCADE,related_name="stationmaster")
    password=models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    sendsms=models.IntegerField()
    
    

    



