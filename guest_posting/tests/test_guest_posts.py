from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
import datetime

from podcasts.models import Podcast, PodcastConfirmation

from guest_posting.api import GuestPostViewSet, GuestSpeakingApplication
from guest_posting.models import GuestPost
from guest_posting.permissions import POSTS_PER_MONTH


class Test(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.user2 = User.objects.create(username="john")
        self.factory = RequestFactory()
        self.request_url = '/api/guest-posts/'
        self.cali_podcast = Podcast.objects.create(owner=self.user, title="Cali Podcast", image_link='caliimglink',
                                                   confirmation=PodcastConfirmation.objects.create(owner=self.user,
                                                                                                   rss_feed_url='helloword'))
        troll_podcast = Podcast.objects.create(owner=self.user, title="Troll Podcast", image_link='trollimglink',
                                               confirmation=PodcastConfirmation.objects.create(owner=self.user,
                                                                                               rss_feed_url='hellowrd'))
        other_user_podcast = Podcast.objects.create(owner=self.user2, title="Other Podcast", image_link='other_podcast',
                                                    confirmation=PodcastConfirmation.objects.create(owner=self.user2,
                                                                                                    rss_feed_url='pc2'))
        self.guest_post = GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast,
                                          description='Talking politics in California',
                                          heading='Looking for a Californian')
        self.sample_uuid = self.guest_post.id
        GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast, description='Talking trash in California',
                                 heading='Looking for a Californian Trashman')
        GuestPost.objects.create(owner=self.user, podcast=troll_podcast, heading='Looking for a Troll on Reddit',
                                 description='Join me to discuss reddit trolling.')
        GuestPost.objects.create(owner=self.user2, podcast=other_user_podcast, heading='Podcast for other users',
                                 description='This a podcast by another user.')
        self.old_post = GuestPost.objects.create(owner=self.user2, podcast=other_user_podcast, heading='Podcast for other users',
                                 description='This is an old post.')
        self.old_post.created_at = datetime.datetime.now() - datetime.timedelta(days=32)
        self.old_post.save()

    def test_get_first_page_guest_posts(self):
        request = self.factory.get(self.request_url)
        view = GuestPostViewSet.as_view({'get': 'list'})
        response = view(request, page=0)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data['results'])
        self.assertEqual(len(response.data['results']), 4)
        self.assertEqual(response.data['total_pages'], 1)

    def test_fail_to_get_second_page_guest_posts(self):
        request = self.factory.get(self.request_url, data={'page': 2})
        view = GuestPostViewSet.as_view({'get': 'list'})
        response = view(request, page=2)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_first_post(self):
        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user2)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=self.sample_uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['heading'], 'Looking for a Californian')
        self.assertEqual(response.data['podcast']['title'], 'Cali Podcast')
        self.assertEqual(response.data['has_already_applied'], False)

    def create_inactive_post_return_uuid(self):
        none_active_guest_post = GuestPost.objects.get(heading='Looking for a Californian Trashman', owner=self.user)
        none_active_guest_post.is_active = False
        uuid = none_active_guest_post.id
        none_active_guest_post.save()
        return uuid

    def test_can_retrieve_inactive_post_as_non_owner(self):
        uuid = self.create_inactive_post_return_uuid()

        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user2)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_can_retrieve_inactive_post_as_correct_user(self):
        uuid = self.create_inactive_post_return_uuid()

        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['heading'], 'Looking for a Californian Trashman')
        self.assertEqual(response.data['podcast']['title'], 'Cali Podcast')

    def test_can_retrieve_inactive_post_as_not_authenticated_user(self):
        uuid = self.create_inactive_post_return_uuid()

        request = self.factory.get(self.request_url)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_a_post(self):
        test_user = User.objects.create(username="test_user")
        test_podcast = Podcast.objects.create(owner=test_user, title="Test Podcast", image_link='caliimglink',
                                              confirmation=PodcastConfirmation.objects.create(owner=test_user,
                                                                                              rss_feed_url='helloword'))
        data = {
            'heading': 'Junior Dev in California',
            'description': 'description',
            'podcast_title': test_podcast.title
        }
        request = self.factory.post(self.request_url, data=data)
        view = GuestPostViewSet.as_view({'post': 'create'})
        force_authenticate(request, user=test_user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['heading'], 'Junior Dev in California')
        self.assertEqual(response.data['description'], 'description')

    def test_cant_create_a_post_as_active_post_limit_is_exceeded(self):
        GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast, description='Another trash in California',
                                 heading='Another Post for a Californian Trashman')
        data = {
            'heading': 'Junior Dev in California',
            'description': 'description',
            'podcast_title': self.cali_podcast.title
        }
        request = self.factory.post(self.request_url, data=data)
        view = GuestPostViewSet.as_view({'post': 'create'})
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_create_a_post_as_not_authorised(self):
        for i in range(POSTS_PER_MONTH):
            GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast, description='Another trash in California',
                                 heading='Another Post for a Californian Trashman')

        data = {
            'heading': 'Junior Dev in California',
            'description': 'description',
            'podcast_title': self.cali_podcast.title
        }
        request = self.factory.post(self.request_url, data=data)
        view = GuestPostViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_create_a_post_as_not_verified_podcaster(self):
        user = User.objects.create(username='dave')
        data = {
            'heading': 'Junior Dev in California',
            'description': 'description',
            'podcast_title': self.cali_podcast.title
        }
        request = self.factory.post(self.request_url, data=data)
        view = GuestPostViewSet.as_view({'post': 'create'})
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_show_users_posts_including_none_active(self):
        self.create_inactive_post_return_uuid()
        request = self.factory.get(self.request_url, data={'showUserPosts': True})
        view = GuestPostViewSet.as_view({'get': 'list'})
        force_authenticate(request, user=self.user)
        response = view(request, page=0)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data['results'])
        self.assertEqual(len(response.data['results']), 3)

    def test_show_users_not_authorised_active_posts(self):
        request = self.factory.get(self.request_url, data={'showUserPosts': True})
        view = GuestPostViewSet.as_view({'get': 'list'})
        response = view(request, page=0)
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_requesting_has_already_applied_to_post(self):
        GuestSpeakingApplication.objects.create(applicant=self.user2, guest_post=self.guest_post)
        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user2)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=self.sample_uuid)
        self.assertEqual(response.data['has_already_applied'], True)

    def test_user_correct_host(self):
        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=self.sample_uuid)
        self.assertEqual(response.data['host'], self.user.username)

    def test_dont_show_expired_posts(self):
        post = GuestPost.objects.get(pk=self.sample_uuid)
        post.is_active = False
        post.save()
        request = self.factory.get(self.request_url)
        view = GuestPostViewSet.as_view({'get': 'list'})
        response = view(request, page=0)
        self.assertEqual(len(response.data['results']), 3)
