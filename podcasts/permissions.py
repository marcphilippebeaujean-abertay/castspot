from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

from .models import Podcast, PodcastConfirmation


class AddRssConfirmationPermissions(permissions.BasePermission):

    def has_permission(self, request, view):
        if Podcast.objects.filter(owner=request.user).count() > 0:
            raise PermissionDenied('Exceeded number of podcasts allowed for this account')
        if PodcastConfirmation.objects.filter(pending=True).filter(owner=request.user).count() > 0:
            raise PermissionDenied('You can\'t have more than one podcast confirmation pending at one time')
        return True
