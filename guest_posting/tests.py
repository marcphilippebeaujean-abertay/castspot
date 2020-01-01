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
        user2 = User.objects.create(username="john")
        self.factory = RequestFactory()
        self.request_url = '/api/guest-post/'
        self.cali_podcast = Podcast.objects.create(owner=self.user, title="Cali Podcast", image_link='caliimglink',
                                                   confirmation=PodcastConfirmation.objects.create(owner=self.user,
                                                                                              rss_feed_url='helloword'))
        troll_podcast = Podcast.objects.create(owner=self.user, title="Troll Podcast", image_link='trollimglink',
                                               confirmation=PodcastConfirmation.objects.create(owner=self.user,
                                                                                               rss_feed_url='hellowrd'))
        other_user_podcast = Podcast.objects.create(owner=user2, title="Other Podcast", image_link='other_podcast',
                                                    confirmation=PodcastConfirmation.objects.create(owner=user2,
                                                                                                    rss_feed_url='pc2'))
        self.sample_uuid = GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast,
                                                    description='Talking politics in California',
                                                    heading='Looking for a Californian').id
        GuestPost.objects.create(owner=self.user, podcast=self.cali_podcast, description='Talking trash in California',
                                 heading='Looking for a Californian Trashman')
        GuestPost.objects.create(owner=self.user, podcast=troll_podcast, heading='Looking for a Troll on Reddit',
                                 description='Join me to discuss reddit trolling.')
        GuestPost.objects.create(owner=user2, podcast=other_user_podcast, heading='Podcast for other users',
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
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=self.sample_uuid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['heading'], 'Looking for a Californian')

    def test_cant_retrieve_inactive_post_as_not_authenticated_user(self):
        none_active_guest_post = GuestPost.objects.get(heading='Looking for a Californian Trashman')
        none_active_guest_post.is_active = False
        uuid = none_active_guest_post.id
        none_active_guest_post.save()

        request = self.factory.get(self.request_url)
        view = GuestPostViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=uuid)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_a_post(self):
        request = self.factory.post(self.request_url, data={'heading': 'Junior Facebook Dev', 'description': 'he',
                                                            'podcast_title': 'Cali Podcast'})
        view = GuestPostViewSet.as_view({'post': 'create'})
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_show_users_posts_including_none_active(self):
        none_active_guest_post = GuestPost.objects.get(heading='Looking for a Californian Trashman')
        none_active_guest_post.is_active = False
        none_active_guest_post.save()
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

