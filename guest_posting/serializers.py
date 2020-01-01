from rest_framework import serializers
from .models import GuestPost
from podcasts.serializers import PodcastSerializer


class GuestPostSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer(read_only=True)

    class Meta:
        model = GuestPost
        fields = ('id', 'heading', 'description', 'podcast')