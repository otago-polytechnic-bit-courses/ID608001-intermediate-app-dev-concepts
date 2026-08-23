from rest_framework import serializers
from .models import Studio, StudioClass, Booking


class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at"]


class BookingSerializer(serializers.ModelSerializer):
    member = serializers.HiddenField(default=serializers.CurrentUserDefault())
    member_name = serializers.CharField(source="member.username", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "member",
            "member_name",
            "studio_class",
            "status",
            "booked_at",
            "attended",
        ]
        read_only_fields = ["booked_at"]


class StudioClassSerializer(serializers.ModelSerializer):
    booking_count = serializers.IntegerField(read_only=True)
    spaces_left = serializers.SerializerMethodField()

    class Meta:
        model = StudioClass
        fields = ["id", "studio", "name", "capacity", "booking_count", "spaces_left"]

    def get_spaces_left(self, obj):
        return obj.capacity - getattr(obj, "booking_count", obj.bookings.count())


class StudioDetailSerializer(serializers.ModelSerializer):
    classes = StudioClassSerializer(many=True, read_only=True)

    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at", "classes"]