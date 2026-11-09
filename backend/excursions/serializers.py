from rest_framework import serializers

from .models import Departure, Itinerary


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ("title", "slug", "description")


class UpcomingDepartureSerializer(serializers.ModelSerializer):
    itinerary = ItinerarySerializer(read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Departure
        fields = ("id", "itinerary", "status", "status_label", "starts_at")
