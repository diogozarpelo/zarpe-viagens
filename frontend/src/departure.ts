export type Departure = {
  id: number
  itinerary: {
    title: string
    slug: string
    description: string
  }
  status_label: string
  starts_at: string | null
}

export function isDeparture(value: unknown): value is Departure {
  if (typeof value !== 'object' || value === null) return false

  const { id, itinerary, status_label, starts_at } = value as Partial<Departure>

  return (
    typeof id === 'number' &&
    typeof itinerary?.title === 'string' &&
    typeof itinerary.slug === 'string' &&
    typeof itinerary.description === 'string' &&
    typeof status_label === 'string' &&
    (starts_at === null ||
      (typeof starts_at === 'string' && Number.isFinite(Date.parse(starts_at))))
  )
}
