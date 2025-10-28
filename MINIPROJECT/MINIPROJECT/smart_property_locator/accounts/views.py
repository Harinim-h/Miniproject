# users/views.py
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view.
    You can extend the serializer to add extra fields in the token response if needed.
    """
    pass  # Using default TokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for registering a new user.
    Anyone can access this endpoint.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and updating the authenticated user's profile.
    Only the logged-in user can access their own profile.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Returns the currently logged-in user.
        """
        return self.request.user

class UserListView(generics.ListAPIView):
    """
    API endpoint to list all users.
    Only admin users can access this endpoint.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to retrieve, update, or delete a specific user by ID.
    Only admin users can manage users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
