from django.db import models

# Create your models here.
class UserTypeMaster(models.Model):
    typeid=models.AutoField(primary_key=True)
    typename=models.CharField(max_length=200,null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.typeid}"
