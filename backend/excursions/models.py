from django.db import models


class Itinerary(models.Model):
    title = models.CharField("título", max_length=120)
    slug = models.SlugField("identificador da URL", max_length=140, unique=True)
    description = models.TextField("descrição")

    class Meta:
        verbose_name = "roteiro"
        verbose_name_plural = "roteiros"

    def __str__(self):
        return self.title


class DepartureStatus(models.TextChoices):
    PLANNING = "planning", "Em planejamento"
    SCHEDULED = "scheduled", "Programada"


class Departure(models.Model):
    itinerary = models.ForeignKey(
        Itinerary,
        verbose_name="roteiro",
        on_delete=models.PROTECT,
        related_name="departures",
    )
    status = models.CharField(
        "status",
        max_length=12,
        choices=DepartureStatus.choices,
        default=DepartureStatus.PLANNING,
    )
    starts_at = models.DateTimeField("data e horário de saída", blank=True, null=True)
    capacity = models.PositiveIntegerField("capacidade total", blank=True, null=True)
    is_published = models.BooleanField("publicar no site", default=False)

    class Meta:
        verbose_name = "saída"
        verbose_name_plural = "saídas"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(capacity__isnull=True) | models.Q(capacity__gte=1),
                name="excursions_departure_capacity_positive",
                violation_error_message="A capacidade deve ser maior que zero.",
            ),
            models.CheckConstraint(
                condition=(
                    ~models.Q(status=DepartureStatus.SCHEDULED)
                    | models.Q(starts_at__isnull=False, capacity__isnull=False)
                ),
                name="excursions_departure_scheduled_has_details",
                violation_error_message=(
                    "Informe data, horário e capacidade para programar a saída."
                ),
            ),
        ]

    def __str__(self):
        return f"{self.itinerary} ({self.get_status_display()})"