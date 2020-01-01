from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ContactDetails


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']


class AccountDetailsSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Profile
        fields = ('owner', 'bio')


class ContactDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetails
        fields = ('email', 'discord', 'skype')
