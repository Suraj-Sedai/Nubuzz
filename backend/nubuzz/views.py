from django.shortcuts import render
from django.http import JsonResponse
from .models import Article
# Create your views here.
import requests

def fetch_news():
    api_key = '15866422dea04a8b85fc0ae163cdca13'
    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
    response = requests.get(url)
    data = response.json()
    if data['status'] != 'ok':
        return JsonResponse({'error': 'Failed to fetch news'})
    
    for article in data['articles']:
        Article.objects.create(
            title=article['title'],
            content=article['content'],
            url=article['url'],
            published_at=article['publishedAt'],
            category=article['category'],
            sentiment=article['sentiment'],
            location=article['location']
        )
        
    return data