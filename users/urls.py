from django.urls import path
from django.conf.urls import url
from .api import UserApiView, profile_api_view


urlpatterns = [
    url('profile/', profile_api_view)
]