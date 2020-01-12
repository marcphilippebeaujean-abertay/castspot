from rest_framework import routers
from django.conf.urls import url

from .api import GuestPostViewSet, GuestSpeakingApplicationView, UnpublishPostView

router = routers.DefaultRouter()
router.register('guest-posts', GuestPostViewSet)
urlpatterns = router.urls + [url(r'speaking-application/', GuestSpeakingApplicationView.as_view()),
                             url(r'unpublish-post/', UnpublishPostView.as_view())]
