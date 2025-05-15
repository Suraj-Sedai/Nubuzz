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
            location=article['location'],
            summarize_article=article['summarize_article'],
        )
        
    return data

#adding summarization AI MODEL

from transformers import pipeline
summarizer = pipeline("summarization")

def summarize_article(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({'error': 'Article not found'}, status=404)

    summary = summarizer(article.content, max_length=50, min_length=25, do_sample=False)
    return JsonResponse({'summary': summary[0]['summary_text']})

