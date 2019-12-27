from django.test import TestCase
from rest_auth.models import DefaultTokenModel
from rest_framework.test import force_authenticate
from rest_framework import status
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.test.client import RequestFactory


from .scheduled_jobs import delete_expired_auth_tokens, TOKEN_LIFETIME_HOURS
from .api import AccountDetailsView


class AuthTokenDeleteTest(TestCase):
    def setUp(self):
        now = datetime.now()
        date_to_delete = now - timedelta(hours=(TOKEN_LIFETIME_HOURS+1))
        user_1, user_2 = User.objects.create(), User.objects.create(username='lol')
        DefaultTokenModel.objects.create(key='deletethistoken', created=date_to_delete, user_id=user_1.id)
        delete_token = DefaultTokenModel.objects.get(key='deletethistoken')
        delete_token.created = date_to_delete
        delete_token.save()
        DefaultTokenModel.objects.create(key='dontdeletethistoken', created=now, user_id=user_2.id)
        delete_expired_auth_tokens()

    def test_does_not_delete(self):
        self.assertIsNotNone(DefaultTokenModel.objects.get(key='dontdeletethistoken'))

    def test_does_delete(self):
        self.assertRaises(DefaultTokenModel.DoesNotExist, DefaultTokenModel.objects.get, key='deletethistoken')


class TestAccountDetailsView(TestCase):
    def setUp(self):
        self.email = "marcphilippebeaujean@gmail.com"
        self.username = "donald"
        self.user = User.objects.create(username=self.username, email=self.email)
        self.view = AccountDetailsView.as_view()
        self.factory = RequestFactory()
        self.request_url = '/api/account-details/'

    def not_authorized(self):
        request = self.factory.get(self.request_url, {'username': self.username}, format='json')
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def get_user_dont_exist(self):
        request = self.factory.get(self.request_url, {'username': self.username}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertContains(response.data, 'owner')
        self.assertEqual(response.data.owner.email, self.email)
        self.assertEqual(response.data.owner.username, self.username)
