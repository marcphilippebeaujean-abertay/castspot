from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User

from podcasts.models import Podcast, PodcastConfirmation

from .api import GuestPostViewSet
from .models import GuestPost


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
        self.sample_uuid = GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast,
                                                    description='Talking politics in California',
                                                    heading='Looking for a Californian').id
        GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast, description='Talking trash in California',
                                 heading='Looking for a Californian Trashman')
        GuestPost.objects.create(owner=self.user, podcast=troll_podcast, heading='Looking for a Troll on Reddit',
                                 description='Join me to discuss reddit trolling.')
        GuestPost.objects.create(owner=self.user2, podcast=other_user_podcast, heading='Podcast for other users',
                                 description='This a podcast by another user.')

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
        force_authenticate(request, user=self.user)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=self.sample_uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['heading'], 'Looking for a Californian')
        self.assertEqual(response.data['podcast']['title'], 'Cali Podcast')

    def create_inactive_post_return_uuid(self):
        none_active_guest_post = GuestPost.objects.get(heading='Looking for a Californian Trashman', owner=self.user)
        none_active_guest_post.is_active = False
        uuid = none_active_guest_post.id
        none_active_guest_post.save()
        return uuid

    def test_cant_retrieve_inactive_post_as_wrong_user(self):
        uuid = self.create_inactive_post_return_uuid()

        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user2)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_retrieve_inactive_post_as_wrong_user(self):
        uuid = self.create_inactive_post_return_uuid()

        request = self.factory.get(self.request_url)
        force_authenticate(request, user=self.user)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['heading'], 'Looking for a Californian Trashman')
        self.assertEqual(response.data['podcast']['title'], 'Cali Podcast')

    def test_cant_retrieve_inactive_post_as_not_authenticated_user(self):
        uuid = self.create_inactive_post_return_uuid()

        request = self.factory.get(self.request_url)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_a_post(self):
        data = {
            'heading': 'Junior Dev in California',
            'description': 'description',
            'podcast_title': self.cali_podcast.title
        }
        request = self.factory.post(self.request_url, data=data)
        view = GuestPostViewSet.as_view({'post': 'create'})
        force_authenticate(request, user=self.user)
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

    def test_update_post(self):
        data = {
            'id': self.sample_uuid,
            'heading': 'New Heading',
            'description': 'new description',
        }
        request = self.factory.patch(self.request_url, data=data)
        view = GuestPostViewSet.as_view({'patch': 'partial_update'})
        force_authenticate(request, user=self.user)
        response = view(request, pk=self.sample_uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['heading'], 'New Heading')
        self.assertEqual(response.data['description'], 'new description')

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
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)