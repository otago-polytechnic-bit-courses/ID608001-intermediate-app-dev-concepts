from rest_framework import serializers
from .models import Studio, StudioClass


class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at"]


class StudioClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioClass
        fields = ["id", "studio", "name"]


class StudioDetailSerializer(serializers.ModelSerializer):
    classes = StudioClassSerializer(many=True, read_only=True)

    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at", "classes"]