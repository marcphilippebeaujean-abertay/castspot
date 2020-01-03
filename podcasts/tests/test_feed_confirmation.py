from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User

from podcasts.api import RssFeedConfirmationRequestView
from podcasts.models import PodcastConfirmation, Podcast

JUNIOR_DEV_PODCAST_FEED_URL = 'https://feed.podbean.com/juniordevcast/feed.xml'


class TestRssFeedConfirmationRequest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.view = RssFeedConfirmationRequestView.as_view()
        self.factory = RequestFactory()
        self.valid_feed_data = {'rssFeed': JUNIOR_DEV_PODCAST_FEED_URL}
        self.invalid_feed_data = {'rssFeed': 'https://byteschool.io/blog/rss.xml'}
        self.request_url = '/api/rss-feed-confirmation/'

    def test_not_authenticated(self):
        PodcastConfirmation.objects.create(owner=self.user)
        request = self.factory.post(self.request_url, self.valid_feed_data, format='json')
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_pending_confirmation(self):
        PodcastConfirmation.objects.create(owner=self.user)
        request = self.factory.post(self.request_url, self.valid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_no_rss_feed(self):
        request = self.factory.post(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    def test_valid_podcast_rss_feed(self):
        request = self.factory.post(self.request_url, self.valid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_podcast_rss_feed(self):
        request = self.factory.post(self.request_url, self.invalid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_podcast_limit_succeeded(self):
        PodcastConfirmation.objects.create(owner=self.user)
        podcast_confirmation = PodcastConfirmation.objects.filter(owner=self.user)[0]
        Podcast.objects.create(owner=self.user, confirmation=podcast_confirmation)
        request = self.factory.post(self.request_url, self.invalid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
