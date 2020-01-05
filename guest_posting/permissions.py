from rest_framework import permissions, exceptions

from .models import GuestPost


ACTIVE_POSTS_PER_PODCAST = 1


class GuestPostPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if not obj.is_active and request.user != obj.owner:
                return False
            return True
        return request.user == obj.owner

    def has_permission(self, request, view):
        if request.method == "POST":
            if not request.user.is_authenticated:
                raise exceptions.PermissionDenied('You need to log in!')
            # TODO: filter by posts per podcast
            #podcast = Podcast.objects.get(title=request.data['podcast_title'])
            if GuestPost.objects.filter(owner=request.user,
                                        is_active=True).count() >= ACTIVE_POSTS_PER_PODCAST:
                raise exceptions.PermissionDenied(f'Only {ACTIVE_POSTS_PER_PODCAST} active posts allowed per Podcast')
        return True
