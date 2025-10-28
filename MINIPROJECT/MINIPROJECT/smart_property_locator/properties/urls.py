# smart_property_locator/properties/urls.py
from django.urls import path
from .views import (
    AmenityListCreateView, AmenityDetailView,
    PropertyListCreateView, PropertyDetailView,
)

urlpatterns = [ # <--- This line is critical, it must be a list
    path('amenities/', AmenityListCreateView.as_view(), name='amenity-list-create'),
    path('amenities/<int:pk>/', AmenityDetailView.as_view(), name='amenity-detail'),
    path('properties/', PropertyListCreateView.as_view(), name='property-list-create'),
    path('properties/<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    
]