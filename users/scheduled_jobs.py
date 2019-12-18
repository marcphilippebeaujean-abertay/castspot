from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from rest_auth.models import DefaultTokenModel
from django.utils.timezone import make_aware

TOKEN_LIFETIME_HOURS = 8
TOKEN_CHECK_INTERVAL_HOURS = 1


def delete_expired_auth_tokens():
    expiration_time = make_aware(datetime.now() - timedelta(hours=TOKEN_LIFETIME_HOURS))
    expired_tokens = DefaultTokenModel.objects.filter(created__lte=expiration_time)
    for token in expired_tokens:
        token.delete()


def init_jobs():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_auth_tokens, 'interval', hours=TOKEN_CHECK_INTERVAL_HOURS)
    scheduler.start()
