from django.test import TestCase
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from django.test.client import RequestFactory

from users.api import AccountDetailsView


class TestAccountDetailsView(TestCase):
    def setUp(self):
        self.email = "marcphilippebeaujean@gmail.com"
        self.username = "donald"
        self.user = User.objects.create(username=self.username, email=self.email)
        self.view = AccountDetailsView.as_view()
        self.factory = RequestFactory()
        self.request_url = '/api/account-details/'

    def test_not_authorized(self):
        request = self.factory.get(self.request_url, {}, format='json')
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_info(self):
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.data['owner']['email'], self.email)
        self.assertEqual(response.data['owner']['username'], self.username)