from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from .serializers import UserProfileSerializer
from .models import Profile
from .permissions import IsOwnerReadOnly


class ProfileView(APIView):
    permission_classes = (IsOwnerReadOnly,)

    def get(self, request):
        if 'username' not in request.GET:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        profile_owner = User.objects.get(username=request.GET.get('username', ''))
        profile, _ = Profile.objects.get_or_create(pk=profile_owner.id)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=201)

