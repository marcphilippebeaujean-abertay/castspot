from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    owner = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    bio = models.CharField(max_length=400, default="")


class ContactDetails(models.Model):
    owner = models.OneToOneField(User, primary_key=False, null=True, blank=True, on_delete=models.CASCADE)
    email = models.CharField(max_length=30, default="")
    discord = models.CharField(max_length=30, default="")
    skype = models.CharField(max_length=30, default="")
