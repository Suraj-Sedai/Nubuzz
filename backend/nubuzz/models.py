# models.py
from django.db import models

class Article(models.Model):
    source_id         = models.CharField(max_length=100, blank=True)
    source_name       = models.CharField(max_length=100, blank=True)
    author            = models.CharField(max_length=200, blank=True)
    category          = models.CharField(max_length=100, blank=True)
    title             = models.CharField(max_length=300)
    description       = models.TextField(blank=True)
    content           = models.TextField(blank=True)
    url               = models.URLField(unique=True)
    url_to_image      = models.URLField(blank=True)
    published_at      = models.DateTimeField()
    sentiment         = models.CharField(max_length=50, default='neutral')
    location          = models.CharField(max_length=100, default='unknown')
    summarize_article = models.TextField(blank=True)

    def __str__(self):
        return self.title
