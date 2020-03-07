from rest_framework import exceptions, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from datetime import datetime, timedelta

from .models import GuestPost, GuestSpeakingApplication
from .serializers import GuestPostSerializer
from .permissions import GuestPostPermissions, CanApplyToGuestPost, APPLICATIONS_ALLOWED_PER_MONTH
from .pagination import GuestPostPagination
from .utils import get_applications_sent_this_month_by_user, send_application


DAYS_TILL_POST_EXPIRATION = 31


class GuestPostViewSet(viewsets.ViewSet,
                       viewsets.generics.ListCreateAPIView,
                       viewsets.mixins.RetrieveModelMixin):
    permission_classes = (GuestPostPermissions,)
    serializer_class = GuestPostSerializer
    queryset = GuestPost.objects.all()
    pagination_class = GuestPostPagination

    @method_decorator(cache_page(60 * 60 * 2))
    def list(self, request, *args, **kwargs):
        filter_qs = GuestPost.objects.order_by('created_at').reverse()
        if request.GET.get('showUserPosts', False):
            try:
                filter_qs = filter_qs.filter(owner=self.request.user)
            except:
                raise exceptions.PermissionDenied('Not authorized!')
        else:
            filter_qs = filter_qs.filter(is_active=True,
                                         created_at__gte=datetime.now() - timedelta(days=DAYS_TILL_POST_EXPIRATION))
        queryset = self.filter_queryset(filter_qs)
        try:
            page = self.paginate_queryset(queryset)
        except Exception as e:
            raise exceptions.ParseError('Guest posts for requested pages could not be paginated.')
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            return self.get_paginated_response(data)
        raise exceptions.NotFound('This page of guest postings could not be found.')


class UnpublishPostView(APIView):

    def post(self, request):
        try:
            if not request.user.is_authenticated:
                raise exceptions.PermissionDenied('You need to log in!')
            guest_post = GuestPost.objects.get(pk=request.data.get('pk'))
            if guest_post.owner != request.user:
                raise exceptions.PermissionDenied('You cannot unpublish another users post')
            self.check_object_permissions(request=request, obj=guest_post)
            if guest_post.is_active:
                guest_post.is_active = False
                guest_post.save()
            return Response(status=status.HTTP_200_OK)
        except GuestPost.DoesNotExist:
            raise exceptions.NotFound('The post you tried to unpublish could not be found')


class GuestSpeakingApplicationView(APIView):
    permission_classes = (permissions.IsAuthenticated, CanApplyToGuestPost)

    def post(self, request):
        self.check_permissions(request)
        if 'guestPostId' not in request.data:
            raise exceptions.UnsupportedMediaType('Guest Post ID is missing!')
        guest_post = GuestPost.objects.get(pk=request.data.get('guestPostId'))
        if guest_post.owner == request.user:
            raise exceptions.PermissionDenied('You can\'t apply to your own guest post')
        application = GuestSpeakingApplication(guest_post=guest_post,
                                               application_message=request.data.get('applicationMessage', ' '),
                                               applicant=request.user)
        send_application(application, guest_post)
        application.save()
        applications_left = APPLICATIONS_ALLOWED_PER_MONTH - get_applications_sent_this_month_by_user(request.user)
        return Response({'remainingApplications': applications_left}, status=status.HTTP_201_CREATED)
