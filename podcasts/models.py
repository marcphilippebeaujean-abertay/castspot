from django.db import models
from django.contrib.auth.models import User

from .utils import generate_confirmation_code


class Category(models.Model):
    name = models.CharField(max_length=200)


class PodcastPublishingLinks(models.Model):
    apple_podcast = models.CharField(max_length=200, default="", blank=True)
    spotify = models.CharField(max_length=200, default="", blank=True)
    website = models.CharField(max_length=200, default="", blank=True)


def default_podcast_publishing_link():
    ppl = PodcastPublishingLinks()
    ppl.save()
    return ppl.pk


class PodcastConfirmation(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    rss_feed_url = models.CharField(max_length=300)
    rss_confirmation_code = models.CharField(max_length=8, default=generate_confirmation_code)
    pending = models.BooleanField(default=True)


class Podcast(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    image_link = models.CharField(max_length=300)
    site_link = models.CharField(max_length=500)
    categories = models.ManyToManyField(Category)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    confirmation = models.OneToOneField(PodcastConfirmation, on_delete=models.CASCADE)
    publishing_links = models.OneToOneField(PodcastPublishingLinks, on_delete=models.CASCADE,
                                            default=default_podcast_publishing_link, related_name='podcast')
