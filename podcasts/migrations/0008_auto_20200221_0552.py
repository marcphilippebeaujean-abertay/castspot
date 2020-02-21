# Generated by Django 2.2.7 on 2020-02-21 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0007_auto_20200210_0703'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podcastpublishinglinks',
            name='apple_podcast',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='podcastpublishinglinks',
            name='spotify',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='podcastpublishinglinks',
            name='website',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
    ]