from rest_framework import serializers
from .models import Property, Amenity
from accounts.serializers import UserSerializer # To show owner details

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True) # To display owner info
    amenities = AmenitySerializer(many=True, read_only=True) # To display amenities

    # For creating/updating, allow amenity IDs to be passed
    amenity_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Amenity.objects.all(), source='amenities', write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = ('id', 'owner', 'title', 'description', 'price', 'location',
                  'latitude', 'longitude', 'property_type', 'images', 'amenities', 'amenity_ids',
                  'created_at', 'updated_at')
        read_only_fields = ('owner', 'amenities', 'created_at', 'updated_at')

    def create(self, validated_data):
        amenities_data = validated_data.pop('amenities', [])
        property = Property.objects.create(**validated_data)
        property.amenities.set(amenities_data)
        return property

    def update(self, instance, validated_data):
        amenities_data = validated_data.pop('amenities', [])
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.location = validated_data.get('location', instance.location)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.property_type = validated_data.get('property_type', instance.property_type)
        instance.images = validated_data.get('images', instance.images)
        instance.save()
        instance.amenities.set(amenities_data)
        return instance