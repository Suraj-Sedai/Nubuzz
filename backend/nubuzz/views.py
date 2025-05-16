from django.shortcuts import render
from django.http import JsonResponse
from .models import Article
import requests
from transformers import pipeline

# Initialize summarizer once
summarizer = pipeline("summarization")

def summarize_text(text):
    """Return a 25–50 token summary of text, or empty string if too short."""
    if not text or len(text.split()) < 10:
        return ''
    result = summarizer(text, max_length=50, min_length=25, do_sample=False)
    return result[0]['summary_text']

def fetch_news():
    api_key = '15866422dea04a8b85fc0ae163cdca13'
    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
    response = requests.get(url)
    data = response.json()
    if data.get('status') != 'ok':
        return {'error': 'Failed to fetch news'}

    for raw in data['articles']:
        article_url = raw.get('url')
        if not article_url:
            continue

        # Combine description + content so we have enough text to summarize
        description = raw.get('description') or ''
        content     = raw.get('content') or ''
        combined    = f"{description}\n\n{content}".strip()

        # Prepare fields for creation
        defaults = {
            'title':         raw.get('title'),
            'content':       combined,
            'published_at':  raw.get('publishedAt'),
            'sentiment':     'neutral',
            'location':      raw.get('source', {}).get('name', 'unknown'),
        }

        # Create or get existing Article
        article_obj, created = Article.objects.get_or_create(
            url=article_url,
            defaults=defaults
        )

        # If it already existed but has no summary, generate and save it now
        if not article_obj.summarize_article:
            article_obj.summarize_article = summarize_text(combined)
            article_obj.save()

    return data

def fetch_news_view(request):
    data = fetch_news()
    if 'error' in data:
        return JsonResponse({'status': 'error', 'message': data['error']}, status=500)

    # Format the most recent 35 articles
    formatted = []
    for art in Article.objects.all().order_by('-published_at')[:35]:
        formatted.append({
            "title":       art.title,
            "description": art.content[:200] if art.content else "",
            "url":         art.url,
            "publishedAt": art.published_at.isoformat(),
            "summary":     art.summarize_article,
            "source":      art.location,
            "image":       "",  # if you later add an image_url field, include it here
        })

    return JsonResponse({
        "status":       "ok",
        "totalResults": len(formatted),
        "articles":     formatted
    }, safe=False)

def summarize_article(request, article_id):
    try:
        art = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({'error': 'Article not found'}, status=404)

    if not art.content or len(art.content.split()) < 10:
        return JsonResponse({'error': 'Content too short for summarization'}, status=400)

    summary = summarize_text(art.content)
    return JsonResponse({'title': art.title, 'summary': summary})
