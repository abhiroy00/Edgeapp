from django.db import models

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