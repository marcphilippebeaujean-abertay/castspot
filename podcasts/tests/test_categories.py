from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.test import force_authenticate
from django.contrib.auth.models import User

from podcasts.api import PodcastConfirmationView
from podcasts.models import PodcastConfirmation, Category

JUNIOR_DEV_PODCAST_FEED_URL = 'https://feed.podbean.com/juniordevcast/feed.xml'


class TestCategories(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="donald")
        self.podcast_confirm_view = PodcastConfirmationView.as_view()
        self.factory = RequestFactory()
        valid_confirmation_code = 'GGJ34KD3'
        valid_confirmation_code_data = {'confirmationCode': valid_confirmation_code}
        request_url = '/api/podcast/'
        PodcastConfirmation.objects.create(owner=self.user,
                                           rss_feed_url=JUNIOR_DEV_PODCAST_FEED_URL,
                                           rss_confirmation_code=valid_confirmation_code)
        request = self.factory.post(request_url, valid_confirmation_code_data, format='json')
        force_authenticate(request, user=self.user)
        response = self.podcast_confirm_view(request)
        self.podcast_name = response.data['title']

    def test_has_categories(self):
        categories_target = ['Technology', 'Business', 'Careers']
        category_entities = Category.objects.all()
        for category in categories_target:
            exists_entity = False
            for category_entity in category_entities:
                if category_entity.name == category:
                    exists_entity = True
                    break
            self.assertTrue(exists_entity)

    def test_query_podcast_with_category(self):
        category = Category.objects.get(name='Technology')
        podcasts = category.podcast_set.all()
        self.assertEqual(len(podcasts), 1)