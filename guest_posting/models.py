from django.db import models
from django.contrib.auth.models import User
from podcasts.models import Podcast
import uuid


class GuestPost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guest_posts')
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    heading = models.CharField(max_length=50, default="")
    description = models.CharField(max_length=500, default="")
    only_podcasters_can_apply = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class GuestSpeakingApplication(models.Model):
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    guest_post = models.ForeignKey(GuestPost, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    application_message = models.CharField(max_length=500, blank=True)
