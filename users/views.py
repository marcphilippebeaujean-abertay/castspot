from django.shortcuts import render

# Create your views here
from rest_framework import generics
from users.models import User
from .serializers import UserSerializer


class UserApiView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
