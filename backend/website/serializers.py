from django.urls import path, include
from django.contrib.auth.models import User
from .models import CustomUser

# serializer is used to transform the models data into json data we can work with

from rest_framework import serializers

# serializer for the welcome page
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','avatar','level','status']

# serializer for the settings
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username','avatar','email','first_name', 'last_name']

# serializer for global infos
class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','avatar','level','status',
                  'friends','email','first_name', 'last_name',
                  'avatar','level','status','date_joined']