from rest_framework import serializers
from .models import Podcast, PodcastPublishingLinks


class PodcastPublishingLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcastPublishingLinks
        fields = ('id', 'spotify', 'apple_podcast', 'website')


class PodcastSerializer(serializers.ModelSerializer):
    rss_url = serializers.SerializerMethodField()
    publishing_links = PodcastPublishingLinksSerializer(read_only=True)

    def get_rss_url(self, obj):
        return obj.confirmation.rss_feed_url

    class Meta:
        model = Podcast
        fields = ('title', 'image_link', 'rss_url', 'publishing_links')


class UserPodcastDataSerializer(serializers.Serializer):
    podcast_confirmation_pending = serializers.BooleanField()
    podcasts = PodcastSerializer(many=True)
