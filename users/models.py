from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    bio = models.CharField(max_length=400)


class CollaborationRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='req_sender')
    receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='req_receiver')

