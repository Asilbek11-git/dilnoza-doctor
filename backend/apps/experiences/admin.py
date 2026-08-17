from django.contrib import admin
from .models import Experience

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('organization', 'position', 'start_year', 'end_year', 'created_at')
    search_fields = ('organization', 'position', 'description')
