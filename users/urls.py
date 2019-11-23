from django.urls import include, path
from .views import UserApiView


urlpatterns = [
    path('users/', UserApiView.as_view()),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
]