from django.test import TestCase
from rest_auth.models import DefaultTokenModel
from datetime import datetime, timedelta
from django.contrib.auth.models import User

from users.scheduled_jobs import delete_expired_auth_tokens, TOKEN_LIFETIME_HOURS


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

