from rest_framework import serializers
from .models import Podcast, PodcastConfirmation


class PodcastConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcastConfirmation
        fields = ('rss_feed_url',)


class PodcastSerializer(serializers.ModelSerializer):
    confirmation = PodcastConfirmationSerializer(read_only=True)

    class Meta:
        model = Podcast
        fields = ('title', 'image_link', 'confirmation')


class UserPodcastDataSerializer(serializers.Serializer):
    podcast_confirmation_pending = serializers.BooleanField()
    podcasts = PodcastSerializer(many=True)
