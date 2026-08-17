from rest_framework import serializers, viewsets, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['title', 'excerpt', 'content', 'category']
    ordering_fields = ['published_at', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), permissions.IsAdminUser()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Article.objects.all()
        return Article.objects.filter(is_published=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        related = Article.objects.filter(is_published=True).exclude(id=instance.id)[:3]
        related_serializer = self.get_serializer(related, many=True)
        return Response({
            'success': True,
            'data': {
                **serializer.data,
                'related_articles': related_serializer.data,
                'medical_disclaimer': 'Ushbu material umumiy ma’lumot uchun. Tibbiy tashxis va davolash uchun shifokorga murojaat qiling.'
            }
        })
