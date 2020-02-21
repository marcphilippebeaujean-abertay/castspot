from django.test import TestCase
from django.test.client import encode_multipart, RequestFactory
from rest_framework import status
from rest_framework.test import force_authenticate
from django.contrib.auth.models import User

from podcasts.api import PodcastLinksView
from podcasts.models import PodcastConfirmation, Podcast
from podcasts.serializers import PodcastPublishingLinksSerializer


class TestPodcastLinks(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.factory = RequestFactory()
        self.view = PodcastLinksView.as_view()
        self.request_url = '/api/podcast-publishing-links/'
        confirmation = PodcastConfirmation.objects.create(owner=self.user)
        self.podcast_id = Podcast.objects.create(owner=self.user,
                                                 title='lol',
                                                 image_link='lol.com',
                                                 confirmation=confirmation).id

    #def test_get_publishing_links(self):
    #    request = self.factory.get(self.request_url, format='json')
    #    response = self.view(request, pk=1)
    #    self.assertEqual(response.status_code, status.HTTP_200_OK)
    #    self.assertEqual(response.data['spotify'], '')

    def test_update_publishing_links_not_authorized(self):
        podcast_links = Podcast.objects.get(pk=self.podcast_id).publishing_links
        podcast_links.spotify = "helloworld"
        content = encode_multipart('BoUnDaRyStRiNg', PodcastPublishingLinksSerializer(podcast_links).data)
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        request = self.factory.post(self.request_url, content, content_type=content_type)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_publishing_links_authorized(self):
        podcast_links = Podcast.objects.get(pk=self.podcast_id).publishing_links
        podcast_links.spotify = "helloworld"
        content = encode_multipart('BoUnDaRyStRiNg', PodcastPublishingLinksSerializer(podcast_links).data)
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        request = self.factory.post(self.request_url, content, content_type=content_type)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['spotify'], 'helloworld')

    def test_update_publishing_links_while_not_owner(self):
        podcast_links = Podcast.objects.get(pk=self.podcast_id).publishing_links
        podcast_links.spotify = "helloworld"
        content = encode_multipart('BoUnDaRyStRiNg', PodcastPublishingLinksSerializer(podcast_links).data)
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        request = self.factory.post(self.request_url, content, content_type=content_type)
        new_user = User.objects.create(username="helloworld")
        force_authenticate(request, user=new_user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)