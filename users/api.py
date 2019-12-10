from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from .serializers import UserProfileSerializer, UserSerializer
from .models import Profile


class UserApiView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['GET'])
def profile_api_view(request):
    if request.method == 'GET':
        # TODO get the real username from the request
        username = request.data.get('username')
        profile_owner = User.objects.get(username='testuser')
        profile, _ = Profile.objects.get_or_create(pk=profile_owner.id)
        profile_serialized = UserProfileSerializer(profile)
        return Response(profile_serialized.data)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

