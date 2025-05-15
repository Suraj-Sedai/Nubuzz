# from django.shortcuts import render
# from django.http import JsonResponse
# from .models import Article
# # Create your views here.
# import requests

# def fetch_news():
#     api_key = '15866422dea04a8b85fc0ae163cdca13'
#     url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
#     response = requests.get(url)
#     data = response.json()
#     if data['status'] != 'ok':
#         return JsonResponse({'error': 'Failed to fetch news'})
    
#     for article in data['articles']:
#         if not Article.objects.filter(url=article.get('url')).exists():
#             Article.objects.create(
#                 title=article.get('title'),
#                 content=article.get('content'),
#                 url=article.get('url'),
#                 published_at=article.get('publishedAt'),
#                 sentiment='neutral',  # You can generate this later using a model
#                 location='unknown',   # Placeholder until NLP or user data is used
#                 summarize_article='', # Leave blank or summarize after storing
#             )

        
#     return data

# def fetch_news_view(request):
#     data = fetch_news()
#     return JsonResponse({'status': 'success', 'fetched_articles': len(data['articles'])})


# #adding summarization AI MODEL

# from transformers import pipeline
# summarizer = pipeline("summarization")

# def summarize_article(request, article_id):
#     try:
#         article = Article.objects.get(id=article_id)
#     except Article.DoesNotExist:
#         return JsonResponse({'error': 'Article not found'}, status=404)

#     summary = summarizer(article.content, max_length=50, min_length=25, do_sample=False)
#     return JsonResponse({'summary': summary[0]['summary_text']})

from django.shortcuts import render
from django.http import JsonResponse
from .models import Article
import requests
from transformers import pipeline

summarizer = pipeline("summarization")

def fetch_news():
    api_key = '15866422dea04a8b85fc0ae163cdca13'
    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
    response = requests.get(url)
    data = response.json()
    if data['status'] != 'ok':
        return {'error': 'Failed to fetch news'}
    
    for article in data['articles']:
        if not Article.objects.filter(url=article.get('url')).exists():
            Article.objects.create(
                title=article.get('title'),
                content=article.get('content'),
                url=article.get('url'),
                published_at=article.get('publishedAt'),
                sentiment='neutral',
                location='unknown',
                summarize_article=''
            )
    return data

def fetch_news_view(request):
    data = fetch_news()
    if 'error' in data:
        return JsonResponse({'error': data['error']}, status=500)
    return JsonResponse({'status': 'success', 'fetched_articles': len(data['articles'])})

def summarize_article(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({'error': 'Article not found'}, status=404)

    if not article.content or len(article.content.split()) < 10:
        return JsonResponse({'error': 'Content too short for summarization'})

    summary = summarizer(article.content, max_length=50, min_length=25, do_sample=False)
    return JsonResponse({'summary': summary[0]['summary_text']})
