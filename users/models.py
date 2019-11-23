from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class CollaborationRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='req_sender')
    receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='req_receiver')


class PublicProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=400)
    website_link = models.CharField(max_length=30)
    linkedin_profile = models.CharField(max_length=30)
    twitter = models.CharField(max_length=30)

