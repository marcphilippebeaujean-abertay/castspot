from rest_framework import exceptions, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GuestPost, GuestSpeakingApplication
from .serializers import GuestPostSerializer
from .permissions import GuestPostPermissions, CanApplyToGuestPost, APPLICATIONS_ALLOWED_PER_MONTH
from .pagination import GuestPostPagination
from .utils import get_applications_sent_this_month_by_user, send_application


class GuestPostViewSet(viewsets.ViewSet,
                       viewsets.generics.ListCreateAPIView,
                       viewsets.mixins.UpdateModelMixin,
                       viewsets.mixins.RetrieveModelMixin):
    permission_classes = (GuestPostPermissions,)
    serializer_class = GuestPostSerializer
    queryset = GuestPost.objects.all()
    pagination_class = GuestPostPagination

    def list(self, request, *args, **kwargs):
        filter_qs = GuestPost.objects.order_by('created_at').reverse()
        if request.GET.get('showUserPosts', False):
            if not request.user.is_authenticated:
                raise exceptions.NotAuthenticated('You need to be authenticated to view your posts.')
            filter_qs = filter_qs.filter(owner=self.request.user)
        else:
            filter_qs = filter_qs.filter(is_active=True)
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

    # TODO: implement working update


class GuestSpeakingApplicationView(APIView):
    permission_classes = (permissions.IsAuthenticated, CanApplyToGuestPost)

    def post(self, request):
        if 'guestPostId' not in request.data:
            raise exceptions.UnsupportedMediaType('Guest Post ID is missing!')
        guest_post = GuestPost.objects.get(pk=request.data.get('guestPostId'))
        if guest_post.owner == request.user:
            raise exceptions.PermissionDenied('You can\'t apply to your own guest post')
        application = GuestSpeakingApplication(guest_post=guest_post,
                                               application_message=request.data.get('applicationMessage', ''),
                                               applicant=request.user)
        send_application(application, guest_post)
        application.save()
        applications_left = APPLICATIONS_ALLOWED_PER_MONTH - get_applications_sent_this_month_by_user(request.user)
        return Response({'remainingApplications': applications_left}, status=status.HTTP_201_CREATED)
