from rest_framework import serializers

from podcasts.models import Podcast
from podcasts.serializers import PodcastSerializer

from .models import GuestPost


class GuestPostSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer(read_only=True, required=False)

    class Meta:
        model = GuestPost
        fields = ('id', 'heading', 'description', 'podcast')

    def create(self, validated_data):
        request = self.context.get('request')
        podcast = Podcast.objects.get(title=request.data.get('podcast_title'))
        return GuestPost.objects.create(owner=request.user,
                                        heading=validated_data.get('heading'),
                                        description=validated_data.get('description', ''),
                                        podcast=podcast)

    def update(self, instance, validated_data):
        instance.heading = validated_data.pop('heading')
        instance.description = validated_data.pop('description')
        instance.save()
        return instance
