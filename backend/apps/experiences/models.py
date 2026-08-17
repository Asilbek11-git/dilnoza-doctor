from django.db import models
from apps.doctors.models import Doctor

class Experience(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='experiences', null=True, blank=True)
    organization = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    start_year = models.IntegerField()
    end_year = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_year']

    def __str__(self):
        return f"{self.organization} - {self.position}"
