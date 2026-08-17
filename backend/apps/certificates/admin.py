from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'year', 'created_at')
    search_fields = ('title', 'organization', 'description')
