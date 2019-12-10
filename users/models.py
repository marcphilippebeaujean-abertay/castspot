from django.db import models
from django.contrib.auth.models import User
from annoying.fields import AutoOneToOneField


class Profile(models.Model):
    owner = AutoOneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    bio = models.CharField(max_length=400, default="")

