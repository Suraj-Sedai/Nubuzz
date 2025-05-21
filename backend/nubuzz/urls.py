# nubuzz/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    fetch_news_view,
    summarize_article,
    ArticleViewSet,
    UserPreferenceUpdateAPIView,
#login and register
    RegisterView,
    CustomAuthToken,
    
)

router = DefaultRouter()
router.register(r'news', ArticleViewSet, basename='news')

urlpatterns = [
    path('fetch-news/', fetch_news_view, name='fetch_news'),
    path('summary/<int:article_id>/', summarize_article, name='summarize_article'),
    path('api/user/preferences/', UserPreferenceUpdateAPIView.as_view(), name='user-preferences'),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', CustomAuthToken.as_view(), name='login'),

]
