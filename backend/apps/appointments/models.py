from django.db import models
from apps.services.models import Service

class AppointmentStatus(models.TextChoices):
    NEW = 'NEW', 'New'
    CONTACTED = 'CONTACTED', 'Contacted'
    CONFIRMED = 'CONFIRMED', 'Confirmed'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'

class Appointment(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    service_title = models.CharField(max_length=255, blank=True, default="Umumiy konsultatsiya")
    preferred_date = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=AppointmentStatus.choices, default=AppointmentStatus.NEW)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.phone} ({self.status})"
