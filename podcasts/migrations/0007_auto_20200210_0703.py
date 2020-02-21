# Generated by Django 2.2.7 on 2020-02-10 07:03

from django.db import migrations, models
import django.db.models.deletion
import podcasts.models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0006_auto_20200209_1647'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podcast',
            name='publishing_links',
            field=models.OneToOneField(default=podcasts.models.default_podcast_publishing_link, on_delete=django.db.models.deletion.CASCADE, related_name='podcast', to='podcasts.PodcastPublishingLinks'),
        ),
    ]