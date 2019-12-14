from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User

from .serializers import AccountDetailsSerializer
from .models import Profile
from .permissions import IsOwnerOnly


class AccountDetailsView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwnerOnly)

    def get(self, request):
        if 'username' not in request.GET:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            profile_owner = User.objects.get(username=request.GET.get('username', ''))
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        profile, _ = Profile.objects.get_or_create(pk=profile_owner.id)
        self.check_object_permissions(request, profile)
        serializer = AccountDetailsSerializer(profile)
        return Response(serializer.data, status=200)
