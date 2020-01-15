from django.test import TestCase
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from django.test.client import RequestFactory

from podcasts.models import Podcast, PodcastConfirmation
from guest_posting.permissions import POSTS_PER_MONTH, APPLICATIONS_ALLOWED_PER_MONTH
from guest_posting.models import GuestSpeakingApplication, GuestPost

from users.api import UserPostingAvailabilityInformationView
from users.models import ContactDetails


class TestAccountDetailsView(TestCase):
    def setUp(self):
        self.email = "marcphilippebeaujean@gmail.com"
        self.username = "donald"
        self.user = User.objects.create(username=self.username, email=self.email)
        self.view = UserPostingAvailabilityInformationView.as_view()
        self.factory = RequestFactory()
        self.request_url = '/api/account-details/'

    def test_not_authorized(self):
        request = self.factory.get(self.request_url, {}, format='json')
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_init(self):
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['hasCreatedContactDetails'])
        self.assertFalse(response.data['isVerifiedPodcaster'])
        self.assertEqual(response.data['postsThisMonth'], POSTS_PER_MONTH)
        self.assertEqual(response.data['applicationsThisMonth'], APPLICATIONS_ALLOWED_PER_MONTH)

    def test_user_is_verified_podcaster(self):
        Podcast.objects.create(owner=self.user, confirmation=PodcastConfirmation.objects.create(owner=self.user))
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['isVerifiedPodcaster'])

    def test_user_has_contacts(self):
        ContactDetails.objects.create(owner=self.user)
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['hasCreatedContactDetails'])

    def test_user_has_applied(self):
        podcast = Podcast.objects.create(owner=self.user, confirmation=PodcastConfirmation.objects.create(owner=self.user))
        post = GuestPost.objects.create(owner=self.user, podcast=podcast)
        GuestSpeakingApplication.objects.create(applicant=self.user, guest_post=post)
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['applicationsThisMonth'], APPLICATIONS_ALLOWED_PER_MONTH - 1)

    def test_user_has_posted(self):
        podcast = Podcast.objects.create(owner=self.user, confirmation=PodcastConfirmation.objects.create(owner=self.user))
        GuestPost.objects.create(owner=self.user, podcast=podcast)
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['postsThisMonth'], POSTS_PER_MONTH - 1)
