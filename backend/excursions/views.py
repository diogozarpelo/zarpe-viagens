from django.db.models import F, Q
from django.utils import timezone
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .models import Departure
from .serializers import UpcomingDepartureSerializer


class UpcomingDepartureList(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UpcomingDepartureSerializer

    def get_queryset(self):
        return (
            Departure.objects.filter(is_published=True)
            .filter(Q(starts_at__isnull=True) | Q(starts_at__gte=timezone.now()))
            .select_related("itinerary")
            .order_by(F("starts_at").asc(nulls_last=True), "pk")
        )
