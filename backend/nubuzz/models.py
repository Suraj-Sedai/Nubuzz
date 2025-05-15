from django.db import models

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=255)
    summary = models.TextField()
    content = models.TextField()
    url = models.URLField()
    category = models.CharField(max_length=100)
    published_at = models.DateTimeField()
    sentiment = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    summarize_article = models.TextField(blank=True)  # ← ADD THIS
