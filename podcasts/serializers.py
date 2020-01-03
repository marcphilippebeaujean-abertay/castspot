from rest_framework import serializers
from .models import Podcast, PodcastConfirmation


class PodcastSerializer(serializers.ModelSerializer):
    rss_url = serializers.SerializerMethodField()

    def get_rss_url(self, obj):
        return obj.confirmation.rss_feed_url

    class Meta:
        model = Podcast
        fields = ('title', 'image_link', 'rss_url')


class UserPodcastDataSerializer(serializers.Serializer):
    podcast_confirmation_pending = serializers.BooleanField()
    podcasts = PodcastSerializer(many=True)
