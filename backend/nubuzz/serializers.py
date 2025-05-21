# nubuzz/serializers.py

from rest_framework import serializers
from .models import Article, UserPreference
from django.contrib.auth.models import User

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Article
        fields = [
            'id',
            'source_id', 'source_name',
            'author',
            'title',
            'description',
            'url',
            'url_to_image',
            'published_at',
            'category',
            'location',
            'summarize_article',
        ]


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserPreference
        fields = ['categories', 'locations']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ('id','username','email')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ('username','email','password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated):
        user = User.objects.create_user(**validated)
        UserPreference.objects.create(user=user)  
        return user