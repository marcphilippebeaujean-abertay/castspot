from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User

from podcasts.models import Podcast, PodcastConfirmation

from guest_posting.api import GuestSpeakingApplicationView
from guest_posting.models import GuestPost, GuestSpeakingApplication


class Test(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.user2 = User.objects.create(username="john")
        self.factory = RequestFactory()
        self.view = GuestSpeakingApplicationView.as_view()
        self.request_url = '/api/speaking-application/'

        Podcast.objects.create(owner=self.user2, title="Pol Podcast", image_link='caliimglink',
                               confirmation=PodcastConfirmation.objects.create(owner=self.user2,
                                                                               rss_feed_url='helloword'))
        self.podcast = Podcast.objects.create(owner=self.user, title="Cali Podcast", image_link='caliimglink',
                                              confirmation=PodcastConfirmation.objects.create(owner=self.user,
                                                                                              rss_feed_url='helloword'))
        self.guest_post = GuestPost.objects.create(owner=self.user, podcast=self.podcast,
                                          description='Talking politics in California',
                                          heading='Looking for a Californian')
        self.sample_uuid = self.guest_post.id

    def test_cant_apply_without_authorization(self):
        request = self.factory.post(self.request_url, data={'guestPostId': self.sample_uuid})
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cant_apply_to_own_post(self):
        request = self.factory.post(self.request_url, data={'guestPostId': self.sample_uuid})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_apply_without_podcast(self):
        no_podcast_user = User.objects.create(username="random_user")
        request = self.factory.post(self.request_url, data={'guestPostId': self.sample_uuid})
        force_authenticate(request, user=no_podcast_user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_apply(self):
        request = self.factory.post(self.request_url, data={'guestPostId': self.sample_uuid})
        force_authenticate(request, user=self.user2)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['remainingApplications'], 9)

    def test_too_many_applications_this_month(self):
        for i in range(10):
            GuestSpeakingApplication.objects.create(applicant=self.user2,
                                                    guest_post=self.guest_post,
                                                    application_message='')
        second_uuid = GuestPost.objects.create(owner=self.user, podcast=self.podcast,
                                               description='Talking politics in California',
                                               heading='Looking for a Californian').id
        request = self.factory.post(self.request_url, data={'guestPostId': second_uuid})
        force_authenticate(request, user=self.user2)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_already_applied_to_post(self):
        GuestSpeakingApplication.objects.create(applicant=self.user2,
                                                guest_post=self.guest_post,
                                                application_message='')
        request = self.factory.post(self.request_url, data={'guestPostId': self.sample_uuid})
        force_authenticate(request, user=self.user2)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'You can\'t apply to the same post more than once')
