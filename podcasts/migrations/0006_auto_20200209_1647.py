# Generated by Django 2.2.7 on 2020-02-09 16:47

from django.db import migrations, models
import django.db.models.deletion
import podcasts.models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0005_auto_20200209_1539'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podcast',
            name='publishing_links',
            field=models.OneToOneField(default=podcasts.models.default_podcast_publishing_link, on_delete=django.db.models.deletion.CASCADE, to='podcasts.PodcastPublishingLinks'),
        ),
    ]