from django.core.management.base import BaseCommand
from django.db import connection, reset_queries
from django.db.models import Avg, Count, F, Max, Q

from studios.models import Booking, Studio, StudioClass


class Command(BaseCommand):
    help = "Demonstrate some advanced ORM features"

    def handle(self, *args, **options):
        self.n_plus_1_problem()
        self.annotation()
        self.aggregation()
        self.f_expressions()
        self.select_and_prefetch_related()

    def n_plus_1_problem(self):
        self.stdout.write(self.style.MIGRATE_HEADING("N+1 problem"))

        reset_queries()
        for studio in Studio.objects.all():
            studio.classes.count()
        self.stdout.write(f"Naive loop: {len(connection.queries)} queries")

        reset_queries()
        list(Studio.objects.annotate(class_count=Count("classes")))
        self.stdout.write(f"Annotated: {len(connection.queries)} queries\n")

    def annotation(self):
        self.stdout.write(self.style.MIGRATE_HEADING("Annotation"))

        for studio in Studio.objects.annotate(class_count=Count("classes")):
            self.stdout.write(f"{studio.name}: {studio.class_count} classes")

        busy_studios = Studio.objects.annotate(
            class_count=Count("classes")
        ).filter(class_count__gte=1)
        self.stdout.write(f"Studios with at least one class: {busy_studios.count()}")

        classes_by_confirmed = StudioClass.objects.annotate(
            confirmed=Count("bookings", filter=Q(bookings__status="confirmed"))
        ).order_by("-confirmed")
        for studio_class in classes_by_confirmed:
            self.stdout.write(f"{studio_class.name}: {studio_class.confirmed} confirmed\n")

    def aggregation(self):
        self.stdout.write(self.style.MIGRATE_HEADING("Aggregation"))

        stats = StudioClass.objects.aggregate(
            average_capacity=Avg("capacity"),
            largest=Max("capacity"),
        )
        self.stdout.write(f"{stats}\n")

    def f_expressions(self):
        self.stdout.write(self.style.MIGRATE_HEADING("F expressions"))

        studio_class = StudioClass.objects.first()
        if studio_class is None:
            self.stdout.write("No StudioClass to demonstrate on - skipping.\n")
            return
        
        original_capacity = studio_class.capacity
        StudioClass.objects.filter(id=studio_class.id).update(capacity=F("capacity") + 1)
        studio_class.refresh_from_db()
        self.stdout.write(f"{studio_class.name} capacity after F() increment: {studio_class.capacity}")

        StudioClass.objects.filter(id=studio_class.id).update(capacity=original_capacity)
        self.stdout.write("Reverted back to original capacity.\n")

    def select_and_prefetch_related(self):
        self.stdout.write(self.style.MIGRATE_HEADING("Following relationships efficiently"))

        reset_queries()
        for booking in Booking.objects.select_related("studio_class"):
            booking.studio_class.name
        self.stdout.write(f"select_related: {len(connection.queries)} queries")

        reset_queries()
        for studio in Studio.objects.prefetch_related("classes"):
            list(studio.classes.all())
        self.stdout.write(f"prefetch_related: {len(connection.queries)} queries")
