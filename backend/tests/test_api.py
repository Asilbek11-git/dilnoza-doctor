from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta

class DoctorAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_doctor_profile(self):
        """Test retrieving public doctor profile."""
        response = self.client.get('/api/v1/doctor/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get('success'))

    def test_create_appointment_success(self):
        """Test booking appointment with valid information."""
        payload = {
            "name": "Ali Valiyev",
            "phone": "+998901234567",
            "email": "ali@example.com",
            "preferred_date": (date.today() + timedelta(days=2)).isoformat(),
            "message": "Konsultatsiya kerak"
        }
        response = self.client.post('/api/v1/appointments/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get('success'))

    def test_create_appointment_invalid_phone(self):
        """Test validation error for invalid phone number."""
        payload = {
            "name": "Ali Valiyev",
            "phone": "12",
            "preferred_date": (date.today() + timedelta(days=2)).isoformat(),
        }
        response = self.client.post('/api/v1/appointments/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_appointment_past_date(self):
        """Test validation error for appointment date in the past."""
        payload = {
            "name": "Ali Valiyev",
            "phone": "+998901234567",
            "preferred_date": (date.today() - timedelta(days=2)).isoformat(),
        }
        response = self.client.post('/api/v1/appointments/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_appointments_list(self):
        """Test that public cannot view protected appointment lists."""
        response = self.client.get('/api/v1/appointments/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
