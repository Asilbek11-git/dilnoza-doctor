from django.db import models
from apps.doctors.models import Doctor

class Certificate(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='certificates', null=True, blank=True)
    title = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    year = models.IntegerField()
    image = models.ImageField(upload_to='certificates/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return self.title
