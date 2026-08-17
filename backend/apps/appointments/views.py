from rest_framework import serializers, viewsets, permissions, status
from rest_framework.response import Response
from datetime import date
from .models import Appointment, AppointmentStatus
from .notifications import send_telegram_notification

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Ismni to‘liq kiriting (kamida 2 ta belgi).")
        return value.strip()

    def validate_phone(self, value):
        if not value or len(value.strip()) < 7:
            raise serializers.ValidationError("Telefon raqami noto‘g‘ri.")
        return value.strip()

    def validate_preferred_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Sana o‘tib ketgan bo‘lishi mumkin emas.")
        return value

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), permissions.IsAdminUser()]

    def list(self, request, *args, **kwargs):
        status_filter = request.query_params.get('status')
        queryset = self.get_queryset()
        if status_filter and status_filter != 'ALL':
            queryset = queryset.filter(status=status_filter)
        
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search) | queryset.filter(phone__icontains=search)

        serializer = self.get_serializer(queryset, many=True)
        return Response({'success': True, 'data': {'count': queryset.count(), 'results': serializer.data}})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save(status=AppointmentStatus.NEW)
        
        # Trigger notification
        send_telegram_notification(appointment)

        return Response({
            'success': True,
            'message': "So‘rovingiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog‘lanamiz.",
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
