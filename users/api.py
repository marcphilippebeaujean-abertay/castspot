from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User

from .serializers import AccountDetailsSerializer, ContactDetailsSerializer
from .models import Profile, ContactDetails


class AccountDetailsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        self.check_permissions(request)
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
        self.check_permissions(request)
        owner = User.objects.get(username=request.user)
        contact_information, _ = ContactDetails.objects.get_or_create(owner=owner, defaults={'email': owner.email})
        serializer = ContactDetailsSerializer(contact_information)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # TODO: Really an update view, how to do in Django?
    def post(self, request):
        self.check_permissions(request)
        owner = User.objects.get(username=request.user)
        contact_information, _ = ContactDetails.objects.get_or_create(owner=owner, defaults={'email': owner.email})
        contact_information.email = request.data.get('email', '')
        contact_information.discord = request.data.get('discord', '')
        contact_information.skype = request.data.get('skype', '')
        contact_information.save()
        return Response(status=status.HTTP_200_OK)


