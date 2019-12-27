from rest_framework import serializers
from .models import Podcast


class PodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ('title', 'image_link')


class UserPodcastDataSerializer(serializers.Serializer):
    podcast_confirmation_pending = serializers.BooleanField()
    podcasts = PodcastSerializer(many=True)
