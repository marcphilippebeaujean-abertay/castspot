from django.conf.urls import url
from .api import AccountDetailsView, UserContactDetailsView


urlpatterns = [
    url('account-details/', AccountDetailsView.as_view()),
    url('user-contact-details/', UserContactDetailsView.as_view()),
]