from django.contrib.auth.models import User
from django.db import models


class Studio(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="studios",
    )
    name = models.CharField(max_length=200)
    suburb = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Booking(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "confirmed", "Confirmed"
        WAITLISTED = "waitlisted", "Waitlisted"
        CANCELLED = "cancelled", "Cancelled"

    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    studio_class = models.ForeignKey(
        "StudioClass", on_delete=models.CASCADE, related_name="bookings"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.CONFIRMED
    )
    booked_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["member", "studio_class"],
                name="unique_booking_per_member_per_class",
            ),
            models.CheckConstraint(
                condition=models.Q(attended=False) | models.Q(status="confirmed"),
                name="only_confirmed_bookings_can_be_attended",
            ),
        ]

    def __str__(self):
        return f"{self.member.username} - {self.studio_class.name}"


class StudioClass(models.Model):
    studio = models.ForeignKey(
        Studio,
        on_delete=models.CASCADE,
        related_name="classes",
    )
    name = models.CharField(max_length=200)
    capacity = models.PositiveIntegerField()
    members = models.ManyToManyField(User, through="Booking", related_name="classes_booked")

    def __str__(self):
        return f"{self.name} ({self.studio.name})"