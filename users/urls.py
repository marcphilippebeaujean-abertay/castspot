from django.conf.urls import url
from .api import AccountDetailsView


urlpatterns = [
    url('account_details/', AccountDetailsView.as_view())
]