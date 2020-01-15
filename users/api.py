from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User

from podcasts.models import Podcast
from guest_posting.utils import get_number_of_posts_this_month, get_applications_sent_this_month_by_user
from guest_posting.permissions import POSTS_PER_MONTH, APPLICATIONS_ALLOWED_PER_MONTH

from .serializers import AccountDetailsSerializer, ContactDetailsSerializer
from .models import Profile, ContactDetails


class AccountDetailsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            profile_owner = User.objects.get(username=request.user)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        profile, _ = Profile.objects.get_or_create(pk=profile_owner.id)
        serializer = AccountDetailsSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserContactDetailsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        owner = User.objects.get(username=request.user)
        contact_information, _ = ContactDetails.objects.get_or_create(owner=owner, defaults={'email': owner.email})
        serializer = ContactDetailsSerializer(contact_information)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # TODO: Really an update view, how to do in Django?
    def post(self, request):
        owner = User.objects.get(username=request.user)
        contact_information, _ = ContactDetails.objects.get_or_create(owner=owner, defaults={'email': owner.email})
        contact_information.email = request.data.get('email', '')
        contact_information.discord = request.data.get('discord', '')
        contact_information.skype = request.data.get('skype', '')
        contact_information.save()
        return Response(status=status.HTTP_200_OK)


class UserPostingAvailabilityInformationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = User.objects.get(username=request.user)
        user_podcasts = Podcast.objects.filter(owner=user)
        contact_details = ContactDetails.objects.filter(owner=user)
        posts_this_month = get_number_of_posts_this_month(user)
        applications_this_month = get_applications_sent_this_month_by_user(user)
        return Response({
            'isVerifiedPodcaster': len(user_podcasts) > 0,
            'hasCreatedContactDetails': len(contact_details) > 0,
            'postsThisMonth': POSTS_PER_MONTH - posts_this_month,
            'applicationsThisMonth': APPLICATIONS_ALLOWED_PER_MONTH - applications_this_month
        }, status=status.HTTP_200_OK)

