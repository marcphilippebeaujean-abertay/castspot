from datetime import datetime, timedelta
from .models import GuestSpeakingApplication


def get_applications_sent_this_month_by_user(user):
    one_month_ago = datetime.now() - timedelta(days=32)
    return GuestSpeakingApplication.objects.filter(applicant=user, created_at__gte=one_month_ago).count()
