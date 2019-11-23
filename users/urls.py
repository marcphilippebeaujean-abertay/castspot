from django.urls import include, path
from .views import UserApiView


urlpatterns = [
    path('users/', UserApiView.as_view()),
]