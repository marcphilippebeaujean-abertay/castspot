from django.conf.urls import url
from .api import PodcastConfirmationView, RssFeedConfirmationRequestView, UserPodcastView


urlpatterns = [
    url('rss-feed-confirmation/', RssFeedConfirmationRequestView.as_view()),
    url(r'podcast-user-data/', UserPodcastView.as_view()),
    url(r'podcast-confirmation/', PodcastConfirmationView.as_view()),
]

