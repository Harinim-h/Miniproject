from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Property, Amenity
from .serializers import PropertySerializer, AmenitySerializer
from .permissions import IsOwnerOrAdminOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

class AmenityListCreateView(generics.ListCreateAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAdminUser] # Only admins can create/list amenities

class AmenityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAdminUser] # Only admins can manage amenities

class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can list/create
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'location', 'owner']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly] # Owner or Admin can edit/delete, anyone can view        this is already in views.py