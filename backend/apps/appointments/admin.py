from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'service_title', 'preferred_date', 'status', 'created_at')
    list_filter = ('status', 'preferred_date', 'created_at')
    search_fields = ('name', 'phone', 'email', 'message')
    ordering = ('-created_at',)
