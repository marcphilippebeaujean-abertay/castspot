from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from smtplib import SMTPException

import feedparser

from .models import PodcastConfirmation, Podcast
from .utils import generate_confirmation_code, send_podcast_confirmation_code_email, create_podcast_from_confirmation
from .serializers import UserPodcastDataSerializer


class RssFeedConfirmationRequestView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        owner = User.objects.get(username=request.user)
        if Podcast.objects.filter(owner=owner).count() > 0:
            return Response({'error': 'Exceeded number of podcasts allowed for this account.'},
                            status=status.HTTP_403_FORBIDDEN)
        if PodcastConfirmation.objects.filter(pending=True).filter(owner=owner).count() > 0:
            return Response({'error': 'You can\'t have more than one podcast confirmation pending at one time'},
                            status=status.HTTP_403_FORBIDDEN)
        if 'rssFeed' not in request.POST:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        rss_feed_url = request.POST.get('rssFeed')
        try:
            rss_feed_parser = feedparser.parse(rss_feed_url)
            email = rss_feed_parser.feed.author_detail.email

            rss_confirmation_code = generate_confirmation_code()

            send_podcast_confirmation_code_email(email, rss_confirmation_code)

            PodcastConfirmation.objects.create(rss_feed_url=rss_feed_url,
                                               owner=owner,
                                               rss_confirmation_code=rss_confirmation_code)
            return Response(status=status.HTTP_200_OK)
        except AttributeError:
            return Response({'error': 'Could not read RSS. Please ensure it is valid and that it contains an email '
                                      'field.'}, status=status.HTTP_400_BAD_REQUEST)
        except SMTPException:
            return Response({'error': 'Failed to send out the confirmation email, please ensure the one listed in your'
                                      'rss feed is valid'}, status=status.HTTP_400_BAD_REQUEST)


class PodcastConfirmationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if 'confirmationCode' not in request.POST:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            confirmation_code = request.POST.get('confirmationCode')
            rss_code_confirmation = PodcastConfirmation.objects\
                .filter(pending=True, owner=request.user)\
                .get(rss_confirmation_code=confirmation_code)
            rss_code_confirmation.pending = False
            rss_code_confirmation.save()
            if rss_code_confirmation.created_at < (timezone.now() - timedelta(hours=2)):
                return Response({'error': 'Code invalid'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                create_podcast_from_confirmation(rss_code_confirmation)
            return Response(status=status.HTTP_200_OK)
        except AttributeError:
            return Response({'error': 'Could not read podcast RSS. Please ensure it is valid and resubmit. It should'
                                      'contain a title, description/summary and image link.'},
                            status=status.HTTP_400_BAD_REQUEST)
        except PodcastConfirmation.DoesNotExist:
            return Response({'error': 'Code invalid'}, status=status.HTTP_400_BAD_REQUEST)


class UserPodcastView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        owner = User.objects.get(username=request.user)
        podcast_confirmation_pending = PodcastConfirmation.objects.filter(owner=request.user, pending=True).count() > 0
        resp_data = {'podcast_confirmation_pending': podcast_confirmation_pending,
                     'podcasts': Podcast.objects.filter(owner=owner)}
        return Response(UserPodcastDataSerializer(resp_data).data, status=status.HTTP_200_OK)
