from rest_framework import serializers
from .models import PodcastConfirmation, Podcast


class PodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ('title', 'image_link')