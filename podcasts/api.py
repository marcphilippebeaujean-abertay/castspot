from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import ParseError, UnsupportedMediaType
from django.utils import timezone
from datetime import timedelta, datetime
from smtplib import SMTPException
import pyPodcastParser.Podcast
import requests

from .permissions import AddRssConfirmationPermissions, RSS_CODE_EXPIRATION_HOURS
from .models import PodcastConfirmation, Podcast, Category
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
            response = requests.get(rss_feed_url)
            if response.status_code is not 200:
                raise ParseError('We couldn\'t access your RSS feed. Make sure that it is hosted somewhere that allows'\
                                 'third parties to download it (CORS is not enabled). A common problem is that the link '\
                                 'you uploaded is hosted on WordPress instead of your Podcast Host.')
            rss_feed_parser = pyPodcastParser.Podcast.Podcast(response.content)
            verify_podcast_with_listen_notes(rss_feed_parser)

            confirmation_code = PodcastConfirmation.objects.create(rss_feed_url=rss_feed_url,
                                                                   owner=request.user).rss_confirmation_code

            email = rss_feed_parser.owner_email
            send_podcast_confirmation_code_email(email, confirmation_code)
            return Response(status=status.HTTP_201_CREATED)
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
            confirmation_expired_time = datetime.now() - timedelta(hours=RSS_CODE_EXPIRATION_HOURS)
            rss_code_confirmation = PodcastConfirmation.objects\
                .filter(pending=True, owner=request.user, created_at__gte=confirmation_expired_time)\
                .get(rss_confirmation_code=confirmation_code)
            rss_code_confirmation.pending = False
            rss_code_confirmation.save()
            if rss_code_confirmation.created_at < (timezone.now() - timedelta(hours=2)):
                raise ParseError('Code invalid')
            else:
                response = requests.get(rss_code_confirmation.rss_feed_url)
                feed_data = pyPodcastParser.Podcast.Podcast(response.content)
                image_url = feed_data.image_link if feed_data.image_link is not None else feed_data.itune_image
                podcast = Podcast.objects.create(owner=request.user,
                                                 title=feed_data.title,
                                                 image_link=image_url,
                                                 confirmation=rss_code_confirmation)
                for category in feed_data.itunes_categories:
                    try:
                        category_entity = Category.objects.get(name=category)
                    except Category.DoesNotExist:
                        category_entity = Category(name=category)
                        category_entity.save()
                    podcast.categories.add(category_entity)
                podcast.save()
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
