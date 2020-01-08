from datetime import datetime, timedelta
from django.core.mail import send_mail
from rest_framework import exceptions

from users.models import ContactDetails
from podcasts.models import Podcast

from .models import GuestSpeakingApplication


def get_applications_sent_this_month_by_user(user):
    one_month_ago = datetime.now() - timedelta(days=32)
    return GuestSpeakingApplication.objects.filter(applicant=user, created_at__gte=one_month_ago).count()


def send_application(application, guest_post):
    message = 'A user has just applied to speak on your podcast via CastSpot! Here are their details: \n'
    message += f'Username: {guest_post.owner.username} \n'
    message += f'Host of the following show: {Podcast.objects.filter(owner=application.applicant)[0].title} \n'
    message += 'They left the following information that you can contact them with: \n'
    try:
        contact_details = ContactDetails.objects.filter(owner=application.applicant)[0]
    except IndexError:
        raise exceptions.ParseError('It looks like you have not added your contact details under the \"Accounts\" section')
    if len(contact_details.email) > 0:
        message += f'Email: {contact_details.email} \n'
    if len(contact_details.discord) > 0:
        message += f'Discord: {contact_details.discord} \n'
    if len(contact_details.skype) > 0:
        message += f'Skype: {contact_details.skype} \n'
    send_mail('You got a new Guest Speaking Application!',
              message,
              'castspot@protonmail.com',  # TODO: REAL EMAIL
              [f'{guest_post.owner.email}'],
              fail_silently=False)
