from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"]
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "full_name",
            "phone",
            "avatar_url",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "email_notifications",
            "order_updates",
            "personalized_offers",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
