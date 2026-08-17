from django.db import models

class Doctor(models.Model):
    full_name = models.CharField(max_length=255, default="Dilnoza Yusupova")
    specialty = models.CharField(max_length=255, default="Shifokor / Terapevt")
    birth_year = models.IntegerField(default=1986)
    experience_years = models.IntegerField(default=20)
    bio = models.TextField()
    photo = models.ImageField(upload_to='doctors/', blank=True, null=True)
    phone = models.CharField(max_length=50, default="+998 90 123 45 67")
    email = models.EmailField(default="doctor@salomat.uz")
    address = models.CharField(max_length=500, default="Toshkent shahri, Salomat Clinic")
    clinic_name = models.CharField(max_length=255, default="Salomat Clinic")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Doctor"
        verbose_name_plural = "Doctors"

    def __str__(self):
        return self.full_name
