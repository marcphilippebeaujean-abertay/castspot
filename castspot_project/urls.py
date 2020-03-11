from django.contrib import admin
from django.urls import path, re_path, include
from django.conf.urls import url
from django.views.generic import TemplateView

urlpatterns = [
    path('api/', include('users.urls')),
    path('api/', include('podcasts.urls')),
    path('api/', include('guest_posting.urls')),

    path('realadmin/', admin.site.urls),
    path('api/', include('rest_framework.urls')),
    path('api/rest-auth/', include('rest_auth.urls')),
    path('api/rest-auth/registration/', include('rest_auth.registration.urls')),

    re_path(r'^(?!api)', TemplateView.as_view(template_name='index.html')),  # serve index.html

    url(r'^', include('django.contrib.auth.urls')),
    path('accounts/', include('allauth.urls')),
]
