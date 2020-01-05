from rest_framework import exceptions, viewsets, status
from rest_framework.response import Response

from .models import GuestPost
from .serializers import GuestPostSerializer
from .permissions import GuestPostPermissions
from .pagination import GuestPostPagination


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
