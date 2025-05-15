from .views import fetch_news,summarize_article
from django.urls import path
from django.http import JsonResponse

app_name = 'nubuzz'
urlpatterns = [
    path('fetch-news/', lambda request: JsonResponse(fetch_news())),
    path('summary/<int:article_id>/', summarize_article),

]