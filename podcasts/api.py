from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import ParseError, UnsupportedMediaType
from django.utils import timezone
from datetime import timedelta
from smtplib import SMTPException
import feedparser

from .permissions import AddRssConfirmationPermissions
from .models import PodcastConfirmation, Podcast
from .utils import send_podcast_confirmation_code_email, verify_podcast_with_listen_notes
from .serializers import UserPodcastDataSerializer, PodcastSerializer


class RssFeedConfirmationRequestView(APIView):
    permission_classes = (permissions.IsAuthenticated, AddRssConfirmationPermissions)

    def post(self, request):
        self.check_permissions(request)
        if 'rssFeed' not in request.data:
            raise UnsupportedMediaType('RSS Feed missing')
        rss_feed_url = request.data.get('rssFeed')
        try:
            rss_feed_parser = feedparser.parse(rss_feed_url)
            verify_podcast_with_listen_notes(rss_feed_parser)

            confirmation_code = PodcastConfirmation.objects.create(rss_feed_url=rss_feed_url,
                                                                   owner=request.user).rss_confirmation_code

            email = rss_feed_parser.feed.author_detail.email
            send_podcast_confirmation_code_email(email, confirmation_code)
            return Response(status=status.HTTP_200_OK)
        except AttributeError:
            raise ParseError('Could not read RSS. Please ensure it is valid and that it contains an email field')
        except SMTPException:
            raise ParseError('Failed to send out the confirmation email, please ensure the one listed in your rss feed '
                             'is valid')


class PodcastConfirmationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        self.check_permissions(request)
        if 'confirmationCode' not in request.data:
            raise UnsupportedMediaType('Confirmation code missing!')
        try:
            confirmation_code = request.data.get('confirmationCode')
            rss_code_confirmation = PodcastConfirmation.objects\
                .filter(pending=True, owner=request.user)\
                .get(rss_confirmation_code=confirmation_code)
            rss_code_confirmation.pending = False
            rss_code_confirmation.save()
            if rss_code_confirmation.created_at < (timezone.now() - timedelta(hours=2)):
                raise ParseError('Code invalid')
            else:
                feed_data = feedparser.parse(rss_code_confirmation.rss_feed_url).feed
                podcast = Podcast.objects.create(owner=request.user,
                                                 title=feed_data.title,
                                                 image_link=feed_data.image.href,
                                                 confirmation=rss_code_confirmation)
                return Response(PodcastSerializer(podcast).data, status=status.HTTP_200_OK)
        except AttributeError:
            raise ParseError('Could not read podcast RSS. Please ensure it is valid and resubmit. It should'
                             'contain a title, description/summary and image link.')
        except PodcastConfirmation.DoesNotExist:
            raise ParseError('Code invalid')


class UserPodcastView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        self.check_permissions(request)
        podcast_confirmation_pending = PodcastConfirmation.objects.filter(owner=request.user, pending=True).count() > 0
        resp_data = {'podcast_confirmation_pending': podcast_confirmation_pending,
                     'podcasts': Podcast.objects.filter(owner=request.user)}
        return Response(UserPodcastDataSerializer(resp_data).data, status=status.HTTP_200_OK)
