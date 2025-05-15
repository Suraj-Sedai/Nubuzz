from django.shortcuts import render
from django.http import JsonResponse
from .models import Article
import requests
from transformers import pipeline

summarizer = pipeline("summarization")

# 🔧 New helper function
def summarize_text(content):
    if not content or len(content.split()) < 10:
        return ''
    summary = summarizer(content, max_length=50, min_length=25, do_sample=False)
    return summary[0]['summary_text']

def fetch_news():
    api_key = '15866422dea04a8b85fc0ae163cdca13'
    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
    response = requests.get(url)
    data = response.json()
    if data['status'] != 'ok':
        return {'error': 'Failed to fetch news'}
    
    for article in data['articles']:
        if not Article.objects.filter(url=article.get('url')).exists():
            content = article.get('content')
            if content:
                summary = summarize_text(content)
            else:
                summary = ''
            
            Article.objects.create(
                title=article.get('title'),
                content=content,
                url=article.get('url'),
                published_at=article.get('publishedAt'),
                sentiment='neutral',
                location='unknown',
                summarize_article=summary,
            )
    return data

def fetch_news_view(request):
    data = fetch_news()
    if 'error' in data:
        return JsonResponse({'status': 'error', 'message': data['error']}, status=500)

    formatted_articles = []

    for article in Article.objects.all().order_by('-published_at')[:35]:  # Limit to latest 35
        formatted_articles.append({
            "title": article.title,
            "description": article.content[:200] if article.content else "",  # optional
            "url": article.url,
            "publishedAt": article.published_at.isoformat(),
            "summary": article.summarize_article,
            "source": article.location,  # You can adjust this
            "image": "",  # You can add `urlToImage` support if you store it
        })

    return JsonResponse({
        "status": "ok",
        "totalResults": len(formatted_articles),
        "articles": formatted_articles
    }, safe=False)

# This remains the view for summarizing existing articles on demand
def summarize_article(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({'error': 'Article not found'}, status=404)

    if not article.content or len(article.content.split()) < 10:
        return JsonResponse({'error': 'Content too short for summarization'}, status=400)

    summary = summarizer(article.content, max_length=60, min_length=25, do_sample=False)
    return JsonResponse({'title': article.title, 'summary': summary[0]['summary_text']})

