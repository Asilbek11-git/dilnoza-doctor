from django.urls import path
from .views import DoctorDetailView

urlpatterns = [
    path('', DoctorDetailView.as_view(), name='doctor-detail'),
]
