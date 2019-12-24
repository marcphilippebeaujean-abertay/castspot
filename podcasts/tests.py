from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .api import RssFeedConfirmationRequestView, PodcastView
from .models import PodcastConfirmation, Podcast

JUNIOR_DEV_PODCAST_FEED_URL = 'https://feed.podbean.com/juniordevcast/feed.xml'


class TestRssFeedConfirmationRequest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.view = RssFeedConfirmationRequestView.as_view()
        self.factory = RequestFactory()
        self.valid_feed_data = {'rssFeed': JUNIOR_DEV_PODCAST_FEED_URL}
        self.invalid_feed_data = {'rssFeed': 'https://byteschool.io/blog/rss.xml'}
        self.request_url = '/api/rss-feed-confirmation/'

    def test_pending_confirmation(self):
        PodcastConfirmation.objects.create(owner=self.user)
        request = self.factory.post(self.request_url, self.valid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_no_rss_feed(self):
        request = self.factory.post(self.request_url, {}, format='json')
        force_authenticate(request, user=User.objects.get(username="donald"))
        view = RssFeedConfirmationRequestView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
        self.assertTrue(response.data.get('error') is not None)


class TestPodcastView(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.view = PodcastView.as_view()
        self.factory = RequestFactory()
        self.valid_confirmation_code = 'GGJ34KD3'
        self.valid_confirmation_code_data = {'confirmationCode': self.valid_confirmation_code}
        self.request_url = '/api/podcast/'

    def test_no_confirmation_code_in_request(self):
        request = self.factory.post(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_confirmation_code_in_database(self):
        request = self.factory.post(self.request_url, self.valid_confirmation_code_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_confirm_podcast(self):
        PodcastConfirmation.objects.create(owner=self.user, rss_feed_url=JUNIOR_DEV_PODCAST_FEED_URL,
                                           rss_confirmation_code=self.valid_confirmation_code)
        request = self.factory.post(self.request_url, self.valid_confirmation_code_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        podcast = Podcast.objects.filter(owner=self.user)[0]
        self.assertEqual(podcast.title, 'The Junior Developer Podcast')
        self.assertEqual(podcast.image_link,
                         'https://pbcdn1.podbean.com/imglogo/image-logo/6716031/junior-dev-podcast-logo-revamp-big.png')

    def test_expired_confirmation_token(self):
        confirmation = PodcastConfirmation(owner=self.user, rss_feed_url=JUNIOR_DEV_PODCAST_FEED_URL,
                                           rss_confirmation_code=self.valid_confirmation_code)
        confirmation.save()
        confirmation.created_at = (timezone.now() - timedelta(hours=3))
        confirmation.save()

        request = self.factory.post(self.request_url, self.valid_confirmation_code_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
