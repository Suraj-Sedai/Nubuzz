# nubuzz/serializers.py

from rest_framework import serializers
from .models import Article, UserPreference

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
            'summary',
        ]


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserPreference
        fields = ['categories', 'locations']
