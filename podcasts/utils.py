import random
import string
import requests
import urllib

from django.core.mail import send_mail
from rest_framework import exceptions


def generate_confirmation_code():
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(8)).upper()


def send_podcast_confirmation_code_email(email, confirmation_code):
    send_mail('Confirm your Podcast',
              'You just submitted a new Podcast. To confirm it, please enter the following code under the '
              '\"My Podcast\" tab: \n'
              f'{confirmation_code} \n'
              'This code will expire in 2-3 hours.',
              'castspot@protonmail.com', # TODO: REAL EMAIL
              [f'{email}'],
              fail_silently=False)


podcast_not_confirmed_error = 'Information in your RSS did not correlate with that of listennotes.com, which is the ' \
                              'directory we use to validate podcasters. Please check your details are correct'


def verify_podcast_with_listen_notes(rss_feed_parser):
    title = rss_feed_parser.feed.title
    email = rss_feed_parser.feed.author_detail.email

    title_query = urllib.parse.urlencode({'q': title})
    url = f'https://listen-api.listennotes.com/api/v2/search?{title_query}&sort_by_date=0&type=podcast&only_in=title'
    headers = {
        'X-ListenAPI-Key': '85d6c128b6cf4c88b17b850effb29d6b',
    }
    response = requests.request('GET', url, headers=headers)
    for result in response.json()['results']:
        if result['title_original'] == title:
            if result['email'] == email:
                return
    raise exceptions.ParseError(podcast_not_confirmed_error)
