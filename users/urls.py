from django.conf.urls import url
from .api import AccountDetailsView


urlpatterns = [
    url('account-details/', AccountDetailsView.as_view())
]