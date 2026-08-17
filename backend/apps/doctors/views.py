from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorDetailView(generics.GenericAPIView):
    serializer_class = DoctorSerializer

    def get_permissions(self):
        if self.request.method in ['PATCH', 'PUT']:
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_object(self):
        doctor = Doctor.objects.filter(is_active=True).first()
        if not doctor:
            doctor = Doctor.objects.create(
                full_name="Dilnoza Yusupova",
                specialty="Shifokor / Terapevt",
                bio="Dilnoza Yusupova — tibbiyot sohasida 20 yildan ortiq professional tajribaga ega shifokor."
            )
        return doctor

    def get(self, request, *args, **kwargs):
        doctor = self.get_object()
        serializer = self.get_serializer(doctor)
        return Response({'success': True, 'data': serializer.data})

    def patch(self, request, *args, **kwargs):
        doctor = self.get_object()
        serializer = self.get_serializer(doctor, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'data': serializer.data})
