from rest_framework import permissions, exceptions

from podcasts.models import Podcast

from .models import GuestPost


ACTIVE_POSTS_PER_PODCAST = 3


class GuestPostPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if not obj.is_active and request.user != obj.owner:
                return False
            return True
        return request.user == obj.owner

    def has_permission(self, request, view):
        if request.method == "POST":
            podcast = Podcast.objects.get(title=request.data['podcast_title'])
            if GuestPost.objects.filter(owner=request.user,
                                        is_active=True,
                                        podcast=podcast).count() >= ACTIVE_POSTS_PER_PODCAST:
                raise exceptions.PermissionDenied(f'Only {ACTIVE_POSTS_PER_PODCAST} active posts allowed per Podcast')
        return True
