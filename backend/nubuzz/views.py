# nubuzz/views.py

from django.http import JsonResponse
from .models import Article, UserPreference
import requests
from transformers import pipeline

from rest_framework import viewsets, generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ArticleSerializer, UserPreferenceSerializer

# initialize summarizer
summarizer = pipeline("summarization")

def summarize_text(text):
    if not text or len(text.split()) < 10:
        return ''
    out = summarizer(text, max_length=50, min_length=25, do_sample=False)
    return out[0]['summary_text']

def fetch_news():
    api_key = '15866422dea04a8b85fc0ae163cdca13'
    url     = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
    resp    = requests.get(url)
    data    = resp.json()
    if data.get('status') != 'ok':
        return {'error': 'Failed to fetch news'}

    for raw in data['articles']:
        article_url = raw.get('url')
        if not article_url:
            continue

        desc     = raw.get('description') or ''
        content  = raw.get('content') or ''
        combined = f"{desc}\n\n{content}".strip()

        obj, created = Article.objects.get_or_create(
            url=article_url,
            defaults={
                'source_id':    raw.get('source', {}).get('id', ''),
                'source_name':  raw.get('source', {}).get('name', ''),
                'author':       raw.get('author') or '',
                'title':        raw.get('title') or '',
                'description':  desc,
                'content':      combined,
                'url_to_image': raw.get('urlToImage') or '',
                'published_at': raw.get('publishedAt'),
                'sentiment':    'neutral',
                'location':     raw.get('source', {}).get('name', 'unknown'),
                'summarize_article': ''
            }
        )

        if not obj.summarize_article:
            obj.summarize_article = summarize_text(combined)
            obj.save()

    return data

def fetch_news_view(request):
    data = fetch_news()
    if 'error' in data:
        return JsonResponse({'status': 'error', 'message': data['error']}, status=500)

    formatted = []
    for art in Article.objects.all().order_by('-published_at')[:35]:
        formatted.append({
            "source":      {"id": art.source_id, "name": art.source_name},
            "author":      art.author or None,
            "title":       art.title,
            "description": art.description or None,
            "url":         art.url,
            "urlToImage":  art.url_to_image or None,
            "publishedAt": art.published_at.isoformat(),
            "content":     art.content or None,
            "summary":     art.summarize_article or None,
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

    return JsonResponse({
        'title':   art.title,
        'summary': summarize_text(art.content)
    })


# ─── DRF ViewSets ───────────────────────────────────────────────────────────────

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /nubuzz/api/news/             → list all articles
    GET /nubuzz/api/news/?category=x  → filter by category
    GET /nubuzz/api/news/?location=y  → filter by location
    """
    queryset         = Article.objects.all().order_by('-published_at')
    serializer_class = ArticleSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ['category', 'location']


class UserPreferenceUpdateAPIView(generics.UpdateAPIView):
    """
    POST /nubuzz/api/user/preferences/ → update the current user’s preferences
    """
    serializer_class   = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, _ = UserPreference.objects.get_or_create(user=self.request.user)
        return obj
