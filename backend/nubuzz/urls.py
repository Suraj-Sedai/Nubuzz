from .views import fetch_news
from django.urls import path
from django.http import JsonResponse

app_name = 'nubuzz'
urlpatterns = [
    path('fetch-news/', lambda request: JsonResponse(fetch_news())),

]