from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User

from podcasts.api import UserPodcastView
from podcasts.models import PodcastConfirmation, Podcast

JUNIOR_DEV_PODCAST_FEED_URL = 'https://feed.podbean.com/juniordevcast/feed.xml'


class TestUserPodcastView(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.view = UserPodcastView.as_view()
        self.factory = RequestFactory()
        self.request_url = '/api/my-podcast/'

    def test_pending_confirmation(self):
        PodcastConfirmation.objects.create(owner=self.user)

        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(response.data['podcast_confirmation_pending'])

    def test_has_confirmed_podcast_no_confirmation(self):
        PodcastConfirmation.objects.create(owner=self.user, rss_feed_url='helloworld')
        podcast_confirm = PodcastConfirmation.objects.filter(owner=self.user)[0]
        podcast_confirm.pending = False
        podcast_confirm.save()
        Podcast.objects.create(owner=self.user, title='Awesomecast', confirmation=podcast_confirm)

        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['podcasts']), 1)
        self.assertEqual(response.data['podcasts'][0]['title'], 'Awesomecast')
        self.assertEqual(response.data['podcasts'][0]['rss_url'], 'helloworld')
        self.assertFalse(response.data['podcast_confirmation_pending'])
