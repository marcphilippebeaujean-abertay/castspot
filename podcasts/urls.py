from django.conf.urls import url
from .api import PodcastView, RssFeedConfirmationRequestView


urlpatterns = [
    url('rss-feed-confirmation/', RssFeedConfirmationRequestView.as_view()),
    url('podcast/', PodcastView.as_view())
]