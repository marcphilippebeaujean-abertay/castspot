# Generated by Django 2.2.7 on 2019-11-20 18:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text_body', models.CharField(max_length=500)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CollaborationBoardPost',
            fields=[
                ('publication_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='publications.Publication')),
                ('title', models.CharField(max_length=30)),
            ],
            bases=('publications.publication',),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('publication_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='publications.Publication')),
                ('karma_points', models.IntegerField(default=0)),
                ('publication', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relatedpub', to='publications.Publication')),
            ],
            bases=('publications.publication',),
        ),
    ]
