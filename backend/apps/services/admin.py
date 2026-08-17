from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'duration_minutes', 'is_active', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('is_active',)
    search_fields = ('title', 'short_description')
