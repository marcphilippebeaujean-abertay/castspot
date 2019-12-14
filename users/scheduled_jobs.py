from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from rest_auth.models import DefaultTokenModel


TOKEN_LIFETIME_HOURS = 8
TOKEN_CHECK_INTERVAL_HOURS = 1


def delete_expired_auth_tokens():
    print('deleting tokens')
    expiration_time = datetime.now() - timedelta(hours=TOKEN_LIFETIME_HOURS)
    DefaultTokenModel.objects.filter(created__lte=expiration_time).delete()


def init_jobs():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_auth_tokens, 'interval', hours=TOKEN_CHECK_INTERVAL_HOURS)
    scheduler.start()
