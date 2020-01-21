from datetime import date, timedelta, datetime
from django.core.mail import send_mail
from rest_framework import exceptions

from users.models import ContactDetails
from podcasts.models import Podcast

from .models import GuestSpeakingApplication, GuestPost


def get_number_of_posts_this_month(user):
    current_month = date(year=datetime.now().year, month=datetime.now().month, day=1)
    return GuestPost.objects.filter(owner=user, created_at__gte=current_month).count()


def get_applications_sent_this_month_by_user(user):
    current_month = date(year=datetime.now().year, month=datetime.now().month, day=1)
    return GuestSpeakingApplication.objects.filter(applicant=user, created_at__gte=current_month).count()


def send_application(application, guest_post):
    message = 'A user has just applied to speak on your podcast via CastSpot! Here are their details: \n'
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
    message += 'You already found the perfect guest or are simply sick of receiving these emails? Use this link to ' \
               'to unpublish your post: '
    # TODO: change this for deploy
    message += f'http://localhost:3000/delete-post/{guest_post.id}'
    send_mail('You got a new Guest Speaking Application!',
              message,
              'castspot.noreply@gmail.com',
              [f'{guest_post.owner.email}'],
              fail_silently=False)
