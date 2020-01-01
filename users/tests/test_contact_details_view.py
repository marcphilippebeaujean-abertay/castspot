from django.test import TestCase
from rest_framework.test import force_authenticate
from rest_framework import status
from django.contrib.auth.models import User
from django.test.client import RequestFactory

from users.api import UserContactDetailsView
from users.models import ContactDetails


class ContactInformationViewTest(TestCase):
    def setUp(self):
        self.email = "marcphilippebeaujean@gmail.com"
        self.username = "donald"
        self.user = User.objects.create(username=self.username, email=self.email)
        self.view = UserContactDetailsView.as_view()
        self.factory = RequestFactory()
        self.request_url = '/api/user-contact-details/'

    def test_get_contact_information_as_authenticated_user(self):
        request = self.factory.get(self.request_url, {}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'marcphilippebeaujean@gmail.com')
        self.assertEqual(response.data['discord'], '')
        self.assertEqual(response.data['skype'], '')

    def test_get_contact_information_without_authentication(self):
        request = self.factory.get(self.request_url, {}, format='json')
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_contact_information(self):
        ContactDetails.objects.create(owner=self.user,
                                      email='cali@gmail.com',
                                      discord='fakediscord')

        request = self.factory.post(self.request_url, {'email': 'cali@gmail.com',
                                                      'discord': 'realdiscord',
                                                      'skype': ''}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)

        contact_details_updated = ContactDetails.objects.get(owner=self.user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(contact_details_updated.email, 'cali@gmail.com')
        self.assertEqual(contact_details_updated.discord, 'realdiscord')
