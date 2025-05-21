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
        fields = ('username','email')

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ('username','email','password','password2')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        UserPreference.objects.create(user=user)
        return user