from django.conf.urls import url
from .api import AccountDetailsView, UserContactDetailsView, UserPostingAvailabilityInformationView


urlpatterns = [
    url('account-details/', AccountDetailsView.as_view()),
    url('user-contact-details/', UserContactDetailsView.as_view()),
    url('posting-availability/', UserPostingAvailabilityInformationView.as_view())
]