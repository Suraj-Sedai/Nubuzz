# nubuzz/views.py

from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Article, UserPreference
import requests

from rest_framework import viewsets, generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ArticleSerializer, UserPreferenceSerializer

NEWS_API_KEY = '15866422dea04a8b85fc0ae163cdca13'

@require_GET
def fetch_news_view(request):
    """
    GET /nubuzz/fetch-news/?category=... 
    → Quickly fetch headlines, upsert into DB, and return JSON array.
    Does NOT summarize here, so it returns in <1s.
    """
    category = request.GET.get('category')
    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={NEWS_API_KEY}'
    if category:
        url += f'&category={category}'

    try:
        resp = requests.get(url, timeout=5)
        data = resp.json()
    except Exception as e:
        return JsonResponse(
            {'status': 'error', 'message': f'NewsAPI request failed: {e}'},
            status=500
        )

    if data.get('status') != 'ok':
        return JsonResponse(
            {'status': 'error', 'message': data.get('message', 'Failed to fetch')},
            status=500
        )

    # Persist articles without summarization
    for raw in data.get('articles', []):
        url = raw.get('url')
        if not url:
            continue

        source = raw.get('source') or {}
        source_id   = source.get('id')   or ''
        source_name = source.get('name') or ''
        title       = raw.get('title')       or ''
        author      = raw.get('author')      or ''
        desc        = raw.get('description') or ''
        content     = raw.get('content')     or ''
        combined    = f"{desc}\n\n{content}".strip()

        Article.objects.update_or_create(
            url=url,
            defaults={
                'source_id':        source_id,
                'source_name':      source_name,
                'title':            title,
                'author':           author,
                'description':      desc,
                'content':          combined,
                'url_to_image':     raw.get('urlToImage') or '',
                'published_at':     raw.get('publishedAt'),
                'location':         source_name or 'unknown',
                'sentiment':        'neutral',
                # leave summarize_article blank for now
            }
        )

    # Return the latest 35 articles as JSON array
    formatted = []
    for art in Article.objects.all().order_by('-published_at')[:35]:
        formatted.append({
            'source':      {'id': art.source_id, 'name': art.source_name},
            'author':      art.author or None,
            'title':       art.title,
            'description': art.description or None,
            'url':         art.url,
            'urlToImage':  art.url_to_image or None,
            'publishedAt': art.published_at.isoformat(),
            'content':     art.content or None,
            # summary is empty until you call /summary/<id>/
            'summary':     art.summarize_article or '',
        })

    return JsonResponse(formatted, safe=False)


# Lazy‐loaded summarizer for on-demand summaries only
from transformers import pipeline
def get_summarizer():
    if not hasattr(get_summarizer, "pipe"):
        get_summarizer.pipe = pipeline("summarization")
    return get_summarizer.pipe


@require_GET
def summarize_article(request, article_id):
    """
    GET /nubuzz/summary/<article_id>/
    → Runs the summarization pipeline (heavy!) only on demand.
    """
    try:
        art = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({'error': 'Article not found'}, status=404)

    if not art.content or len(art.content.split()) < 10:
        return JsonResponse({'error': 'Content too short'}, status=400)

    summarizer = get_summarizer()
    summary = summarizer(art.content, max_length=50, min_length=25, do_sample=False)[0]['summary_text']
    art.summarize_article = summary
    art.save(update_fields=['summarize_article'])

    return JsonResponse({'title': art.title, 'summary': summary})


# ─── DRF ViewSets ───────────────────────────────────────────────────────────────

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Article.objects.all().order_by('-published_at')
    serializer_class = ArticleSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ['category', 'location']


class UserPreferenceUpdateAPIView(generics.UpdateAPIView):
    serializer_class   = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, _ = UserPreference.objects.get_or_create(user=self.request.user)
        return obj
