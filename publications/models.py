from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Publication(models.Model):
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    text_body = models.CharField(max_length=500)


class Comment(Publication):
    karma_points = models.IntegerField(default=0)
    commented_publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='commented_pub')


class CollaborationBoardPost(Publication):
    title = models.CharField(max_length=30)