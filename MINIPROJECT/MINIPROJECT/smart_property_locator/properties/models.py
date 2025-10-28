from django.db import models
from django.contrib.auth.models import User

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    # You could add icon, category, etc.

    def __str__(self):
        return self.name

class Property(models.Model):
    PROPERTY_TYPES = (
        ('APARTMENT', 'Apartment'),
        ('HOUSE', 'House'),
        ('CONDO', 'Condo'),
        ('LAND', 'Land'),
        ('COMMERCIAL', 'Commercial'),
    )

    owner = models.ForeignKey(User, related_name='properties', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255) # e.g., "123 Main St, City, State"
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPES)
    images = models.JSONField(default=list, blank=True) # Store image URLs as a list of strings
    amenities = models.ManyToManyField(Amenity, related_name='properties', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# Note: For real image uploads, you'd use a FileField/ImageField and configure Django's media settings.
# For simplicity, we are storing image URLs here.