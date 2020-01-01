# Generated by Django 2.2.7 on 2019-12-31 11:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('podcasts', '0005_podcast_confirmation'),
    ]

    operations = [
        migrations.CreateModel(
            name='GuestPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=30)),
                ('description', models.CharField(default='', max_length=300)),
                ('episode_airing_date', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('podcast', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='podcasts.Podcast')),
            ],
        ),
        migrations.CreateModel(
            name='GuestSpeakingApplication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('guest_post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='guest_posting.GuestPost')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
