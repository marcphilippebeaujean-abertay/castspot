from rest_framework import serializers, exceptions

from podcasts.models import Podcast
from podcasts.serializers import PodcastSerializer

from .models import GuestPost


class GuestPostSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer(read_only=True, required=False)

    class Meta:
        model = GuestPost
        fields = ('id', 'heading', 'description', 'podcast', 'only_podcasters_can_apply')

    def create(self, validated_data):
        request = self.context.get('request')
        # TODO add podcast title to differentiate between different podcast
        #podcast = Podcast.objects.get(title=request.data.get('podcast_title'))
        try:
            podcast = Podcast.objects.filter(owner=request.user)[0]
        except IndexError:
            raise exceptions.NotFound('You need to own a verified podcast to be to post.')
        heading = validated_data.get('heading')
        if len(heading) < 8:
            raise exceptions.ParseError('Bad inpuz: post heading needs to be at least 8 characters long')
        return GuestPost.objects.create(owner=request.user,
                                        heading=heading,
                                        description=validated_data.get('description', ''),
                                        only_podcasters_can_apply=validated_data.get('only_podcasters_can_apply', True),
                                        podcast=podcast)

    def update(self, instance, validated_data):
        instance.heading = validated_data.pop('heading')
        instance.description = validated_data.pop('description')
        instance.save()
        return instance
