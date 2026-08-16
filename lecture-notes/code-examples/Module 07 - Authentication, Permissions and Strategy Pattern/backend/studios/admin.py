from django.contrib import admin
from .models import Studio, StudioClass


class StudioClassInline(admin.TabularInline):
    model = StudioClass
    extra = 1


@admin.register(Studio)
class StudioAdmin(admin.ModelAdmin):
    list_display = ("name", "suburb", "city")
    search_fields = ("name", "suburb")
    inlines = [StudioClassInline]


@admin.register(StudioClass)
class StudioClassAdmin(admin.ModelAdmin):
    list_display = ("name", "studio")
    list_filter = ("studio",)