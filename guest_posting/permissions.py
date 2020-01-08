from rest_framework import permissions, exceptions

from podcasts.models import Podcast
from .models import GuestPost, GuestSpeakingApplication
from .utils import get_applications_sent_this_month_by_user


ACTIVE_POSTS_PER_PODCAST = 1
APPLICATIONS_ALLOWED_PER_MONTH = 10


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


class CanApplyToGuestPost(permissions.BasePermission):

    def has_permission(self, request, view):
        if Podcast.objects.filter(owner=request.user).count() == 0:
            raise exceptions.PermissionDenied('You need to be a verified podcaster to apply to posts!')
        if get_applications_sent_this_month_by_user(request.user) >= APPLICATIONS_ALLOWED_PER_MONTH:
            raise exceptions.PermissionDenied(f'You cannot apply to more than {APPLICATIONS_ALLOWED_PER_MONTH} '
                                              'times each month')
        if GuestSpeakingApplication.objects.filter(applicant=request.user,
                                                   guest_post=request.data.get('guestPostId')).count() > 0:
            raise exceptions.PermissionDenied('You can\'t apply to the same post more than once')
        return True
