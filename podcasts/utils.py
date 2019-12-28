import random
import string
import feedparser

from django.core.mail import send_mail
from .models import Podcast


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


def create_podcast_from_confirmation(podcast_confirmation):
    rss_feed_parser = feedparser.parse(podcast_confirmation.rss_feed_url)
    podcast = Podcast()
    podcast.title = rss_feed_parser.feed.title
    podcast.image_link = rss_feed_parser.feed.image.href
    podcast.description = rss_feed_parser.feed.summary
    podcast.owner = podcast_confirmation.owner
    podcast.save()
    return podcast
