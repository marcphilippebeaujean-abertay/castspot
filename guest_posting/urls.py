from rest_framework import routers

from .api import GuestPostViewSet

router = routers.DefaultRouter()
router.register('guest-posts', GuestPostViewSet)
urlpatterns = router.urls
