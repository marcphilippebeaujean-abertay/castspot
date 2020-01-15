from rest_framework import permissions, exceptions

from podcasts.models import Podcast
from .models import GuestSpeakingApplication
from .utils import get_applications_sent_this_month_by_user, get_number_of_posts_this_month


POSTS_PER_MONTH = 2
APPLICATIONS_ALLOWED_PER_MONTH = 10


class GuestPostPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.owner

    def has_permission(self, request, view):
        if request.method == "POST":
            if not request.user.is_authenticated:
                raise exceptions.PermissionDenied('You need to log in!')
            # TODO: filter by posts per podcast
            if get_number_of_posts_this_month(user=request.user) >= POSTS_PER_MONTH:
                raise exceptions.PermissionDenied(f'You can only post {POSTS_PER_MONTH} times per month')
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
