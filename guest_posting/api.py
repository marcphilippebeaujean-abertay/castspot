from rest_framework import exceptions, viewsets

from podcasts.models import Podcast

from .models import GuestPost
from .serializers import GuestPostSerializer
from .permissions import GuestPostPermissions
from .pagination import GuestPostPagination


class GuestPostViewSet(viewsets.ViewSet,
                       viewsets.generics.ListCreateAPIView,
                       viewsets.mixins.RetrieveModelMixin,
                       viewsets.mixins.UpdateModelMixin):
    permission_classes = (GuestPostPermissions,)
    serializer_class = GuestPostSerializer
    queryset = GuestPost.objects.all()
    pagination_class = GuestPostPagination

    def perform_create(self, serializer):
        GuestPost.objects.create(heading=self.request.data['heading'], description=self.request.data['description'],
                                 podcast=Podcast.objects.get(title=self.request.data['podcast_title']),
                                 owner=self.request.user)

    def list(self, request, *args, **kwargs):
        filter_qs = GuestPost.objects.order_by('created_at')
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

