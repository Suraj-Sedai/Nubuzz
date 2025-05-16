# nubuzz/models.py

from django.db import models
from django.conf import settings

class Article(models.Model):
    source_id         = models.CharField(max_length=100, blank=True)
    source_name       = models.CharField(max_length=100, blank=True)
    author            = models.CharField(max_length=200, blank=True)
    title             = models.CharField(max_length=300)
    description       = models.TextField(blank=True)
    content           = models.TextField(blank=True)
    url               = models.URLField(unique=True)
    url_to_image      = models.URLField(blank=True)
    published_at      = models.DateTimeField()
    category          = models.CharField(max_length=100, blank=True)     # ← for filtering
    sentiment         = models.CharField(max_length=50, default='neutral')
    location          = models.CharField(max_length=100, default='unknown')
    summarize_article = models.TextField(blank=True)

    def __str__(self):
        return self.title

class UserPreference(models.Model):
    user       = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    categories = models.CharField(max_length=255, blank=True)
    locations  = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Prefs for {self.user.username}"
