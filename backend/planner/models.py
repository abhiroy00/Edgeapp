from django.db import models
from maintenance.models import TaskMaster,TypeMaster,StatusMaster
from users.models import UserMaster

# Create your models here.
class ScheduleCreation(models.Model):
    schedule = models.AutoField(primary_key=True)
    task = models.ForeignKey(TaskMaster, on_delete=models.CASCADE, related_name='schedule_tasks')
    maintenancetype = models.ForeignKey(TypeMaster, on_delete=models.CASCADE, related_name='schedule_types')
    startDate = models.DateField()
    completeDate = models.DateField()
    scheduleDate = models.DateField()
    status = models.ForeignKey(StatusMaster, on_delete=models.CASCADE, related_name='schedule_status')
    isBlockrequired = models.IntegerField()
    blockStartStamp = models.IntegerField()
    blockEndStamp = models.IntegerField()
    auto_dataTable_rid = models.IntegerField()
    auto_assestAttributeLink_id = models.IntegerField()
    auto_boundaryValue = models.IntegerField()
    auto_failureValue = models.IntegerField()
    auto_smsmsg = models.CharField(max_length=500)
    auto_edgeStamp = models.IntegerField()
    auto_cardStamp = models.IntegerField()
    auto_smsStamp = models.IntegerField()
    auto_assignStamp = models.IntegerField()
    user = models.ForeignKey(UserMaster, on_delete=models.CASCADE, related_name='schedule_users')
    app_feedback = models.TextField(blank=True, null=True)
    app_latitude = models.CharField(max_length=100, blank=True, null=True)
    app_longitude = models.CharField(max_length=100, blank=True, null=True)



