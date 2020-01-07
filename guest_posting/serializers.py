from rest_framework import serializers, exceptions

from podcasts.models import Podcast
from podcasts.serializers import PodcastSerializer

from .models import GuestPost, GuestSpeakingApplication


class GuestPostSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer(read_only=True, required=False)

    host = serializers.SerializerMethodField()
    has_already_applied = serializers.SerializerMethodField()

    class Meta:
        model = GuestPost
        fields = ('id', 'heading', 'description', 'podcast', 'host', 'has_already_applied')

    def get_host(self, obj):
        return obj.owner.username

    def get_has_already_applied(self, obj):
        user = self.context.get('request').user
        if not user.is_authenticated:
            return False
        has_applied = GuestSpeakingApplication.objects.filter(guest_post=obj, applicant=user).count() > 0
        return has_applied

    def create(self, validated_data):
        request = self.context.get('request')
        # TODO add podcast title to differentiate between different podcast
        try:
            podcast = Podcast.objects.filter(owner=request.user)[0]
        except IndexError:
            raise exceptions.NotFound('You need to own a verified podcast to be to post.')
        heading = validated_data.get('heading', '')
        if len(heading) < 8:
            raise exceptions.ParseError('Bad input: post heading needs to be at least 8 characters long')
        return GuestPost.objects.create(owner=request.user,
                                        heading=heading,
                                        description=validated_data.get('description', ''),
                                        podcast=podcast)

    def update(self, instance, validated_data):
        instance.heading = validated_data.pop('heading')
        instance.description = validated_data.pop('description')
        instance.save()
        return instance
