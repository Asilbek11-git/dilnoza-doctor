from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('api/v1/doctor/', include('apps.doctors.urls')),
    path('api/v1/services/', include('apps.services.urls')),
    path('api/v1/experiences/', include('apps.experiences.urls')),
    path('api/v1/certificates/', include('apps.certificates.urls')),
    path('api/v1/articles/', include('apps.articles.urls')),
    path('api/v1/faq/', include('apps.faq.urls')),
    path('api/v1/appointments/', include('apps.appointments.urls')),

    # Swagger / OpenAPI documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
