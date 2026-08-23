from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly
from .models import Studio, StudioClass, Booking
from .serializers import (
    StudioSerializer,
    StudioDetailSerializer,
    StudioClassSerializer,
    BookingSerializer,
)


class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return StudioDetailSerializer
        return StudioSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class StudioClassViewSet(viewsets.ModelViewSet):
    queryset = StudioClass.objects.all()
    serializer_class = StudioClassSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

