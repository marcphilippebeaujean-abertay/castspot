from django.urls import include, path
from .api import UserApiView


urlpatterns = [
    path('users/', UserApiView.as_view()),
]