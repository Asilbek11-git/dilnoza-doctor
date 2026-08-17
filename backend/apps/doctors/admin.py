from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'specialty', 'experience_years', 'phone', 'email', 'is_active', 'updated_at')
    search_fields = ('full_name', 'specialty', 'phone', 'email')
