from django.conf.urls import url
from .api import ProfileView


urlpatterns = [
    url('profile/', ProfileView.as_view())
]