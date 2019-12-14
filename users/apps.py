from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        from .scheduled_jobs import init_jobs
        init_jobs()
