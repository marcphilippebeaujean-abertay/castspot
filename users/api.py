from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User

from .serializers import AccountDetailsSerializer
from .models import Profile


class AccountDetailsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            profile_owner = User.objects.get(username=request.user)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        profile, _ = Profile.objects.get_or_create(pk=profile_owner.id)
        self.check_object_permissions(request, profile)
        serializer = AccountDetailsSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
