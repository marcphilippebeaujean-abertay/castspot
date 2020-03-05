from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from podcasts.api import PodcastConfirmationView
from podcasts.models import PodcastConfirmation, Podcast

JUNIOR_DEV_PODCAST_FEED_URL = 'https://feed.podbean.com/juniordevcast/feed.xml'


class TestPodcastConfirmation(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.view = PodcastConfirmationView.as_view()
        self.factory = RequestFactory()
        self.valid_confirmation_code = 'GGJ34KD3'
        self.valid_confirmation_code_data = {'confirmationCode': self.valid_confirmation_code}
        self.request_url = '/api/podcast/'

    def test_unauthorited(self):
        PodcastConfirmation.objects.create(owner=self.user)
        request = self.factory.post(self.request_url, self.valid_confirmation_code_data, format='json')
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_no_confirmation_code_in_request(self):
        request = self.factory.post(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

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
        self.assertEqual(podcast.title, response.data['title'])
        self.assertEqual(podcast.image_link, response.data['image_link'])
        self.assertEqual(response.data['publishing_links']['spotify'], '')

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

    def test_podcast_already_exists(self):
        confirmation = PodcastConfirmation.objects.create(owner=self.user,
                                                          rss_feed_url=JUNIOR_DEV_PODCAST_FEED_URL,
                                                          rss_confirmation_code=self.valid_confirmation_code)
        Podcast.objects.create(owner=self.user,
                               title='The Junior Developer Podcast',
                               image_link='lol.com',
                               confirmation=confirmation)
        request = self.factory.post(self.request_url, self.valid_confirmation_code_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
