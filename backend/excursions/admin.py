from django.contrib import admin

from .models import Departure, Itinerary


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug")
    search_fields = ("title",)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Departure)
class DepartureAdmin(admin.ModelAdmin):
    list_display = ("itinerary", "status", "starts_at", "capacity", "is_published")
    list_filter = ("status", "is_published")
    search_fields = ("itinerary__title",)
    list_select_related = ("itinerary",)