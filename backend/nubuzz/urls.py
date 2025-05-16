from django.urls import path
from .views import fetch_news_view, summarize_article

urlpatterns = [
    path('fetch-news/', fetch_news_view, name='fetch_news'),
    path('summary/<int:article_id>/', summarize_article, name='summarize_article'),
]
