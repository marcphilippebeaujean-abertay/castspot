from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from datetime import timedelta, datetime
import pyPodcastParser.Podcast
import requests

from podcasts.api import RssFeedConfirmationRequestView
from podcasts.models import PodcastConfirmation, Podcast
from podcasts.utils import verify_podcast_with_listen_notes
from podcasts.permissions import RSS_CODE_EXPIRATION_HOURS

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

    def test_outdated_pending_confirmation(self):
        podcast_confirmation = PodcastConfirmation.objects.create(owner=self.user)
        podcast_confirmation.created_at = datetime.now() - timedelta(hours=RSS_CODE_EXPIRATION_HOURS+1)
        podcast_confirmation.save()
        request = self.factory.post(self.request_url, self.valid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_no_rss_feed(self):
        request = self.factory.post(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    def test_valid_podcast_rss_feed(self):
        request = self.factory.post(self.request_url, self.valid_feed_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        rss_feed = PodcastConfirmation.objects.get(rss_feed_url=JUNIOR_DEV_PODCAST_FEED_URL)
        self.assertEqual(len(rss_feed.rss_confirmation_code), 8)

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

    def test_multiple_valid_rss_feeds(self):
        response = requests.get('http://joeroganexp.joerogan.libsynpro.com/rss')
        rss_feed_parser = pyPodcastParser.Podcast.Podcast(response.content)
        verify_podcast_with_listen_notes(rss_feed_parser)
        response = requests.get('http://feeds.backtracks.fm/feeds/indiehackers/indiehackers/feed.xml?1530230413')
        rss_feed_parser = pyPodcastParser.Podcast.Podcast(response.content)
        verify_podcast_with_listen_notes(rss_feed_parser)
        response = requests.get('https://feeds.captivate.fm/podcast-pontifications/')
        rss_feed_parser = pyPodcastParser.Podcast.Podcast(response.content)
        verify_podcast_with_listen_notes(rss_feed_parser)
        # TODO: figure out what to do here cause cors is enabled
        #response = requests.get('https://softwareengineeringdaily.com/feed/podcast/')
        #rss_feed_parser = pyPodcastParser.Podcast.Podcast(response.content)
        #verify_podcast_with_listen_notes(rss_feed_parser)