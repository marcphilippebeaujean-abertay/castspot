from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User

from podcasts.models import Podcast, PodcastConfirmation

from guest_posting.api import UnpublishPostView
from guest_posting.models import GuestPost


class Test(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.user2 = User.objects.create(username="john")
        self.factory = RequestFactory()
        self.view = UnpublishPostView.as_view()
        self.request_url = '/api/unpublish-post/'
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

    def test_post_is_unpublished(self):
        request = self.factory.post(self.request_url, data={'pk': self.sample_uuid})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(GuestPost.objects.get(pk=self.sample_uuid).is_active)

    def test_has_no_permission_to_unpublish_other_users_post(self):
        request = self.factory.post(self.request_url, data={'pk': self.sample_uuid})
        force_authenticate(request, user=self.user2)
        response = self.view(request)
        print(response)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(GuestPost.objects.get(pk=self.sample_uuid).is_active)

    def test_is_not_authorized(self):
        request = self.factory.post(self.request_url, data={'pk': self.sample_uuid})
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(GuestPost.objects.get(pk=self.sample_uuid).is_active)

    def test_post_doesnt_exist(self):
        request = self.factory.post(self.request_url, data={'pk': 'a4333c5b-5ccb-44e3-8f39-cbaf6bbb21ca'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
