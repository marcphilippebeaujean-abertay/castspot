from django.conf.urls import url
from .api import PodcastConfirmationView, RssFeedConfirmationRequestView, UserPodcastView


urlpatterns = [
    url('rss-feed-confirmation/', RssFeedConfirmationRequestView.as_view()),
    url('podcast/', PodcastConfirmationView.as_view()),
    url('user-podcast/', UserPodcastView.as_view())
]