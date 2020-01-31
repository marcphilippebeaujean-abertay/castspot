from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from datetime import timedelta, datetime

from .models import Podcast, PodcastConfirmation


RSS_CODE_EXPIRATION_HOURS = 2


class AddRssConfirmationPermissions(permissions.BasePermission):

    def has_permission(self, request, view):
        if Podcast.objects.filter(owner=request.user).count() > 0:
            raise PermissionDenied('Exceeded number of podcasts allowed for this account')
        confirmation_expired_time = datetime.now() - timedelta(hours=RSS_CODE_EXPIRATION_HOURS)
        if PodcastConfirmation.objects\
                .filter(pending=True, created_at__gte=confirmation_expired_time, owner=request.user).count() > 0:
            raise PermissionDenied('You can\'t have more than one podcast confirmation pending at one time')
        return True
