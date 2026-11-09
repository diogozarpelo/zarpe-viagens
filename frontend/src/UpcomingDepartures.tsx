import { useEffect, useState } from 'react'
import basilicaAparecida from './assets/basilica-aparecida.webp'

type Departure = {
  id: number
  itinerary: {
    title: string
    slug: string
    description: string
  }
  status_label: string
  starts_at: string | null
}

type DepartureState =
  | { phase: 'loading' }
  | { phase: 'ready'; departures: Departure[] }
  | { phase: 'error' }

const departureDate = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

function isDeparture(value: unknown): value is Departure {
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

function DepartureCard({ departure }: { departure: Departure }) {
  const { id, itinerary, status_label, starts_at } = departure
  const titleId = `titulo-saida-${id}`

  return (
    <article className="departure-card" aria-labelledby={titleId}>
      {itinerary.slug === 'aparecida' ? (
        <img
          className="departure-image"
          src={basilicaAparecida}
          alt="Vista da Basílica de Nossa Senhora Aparecida"
          width={840}
          height={560}
          decoding="async"
        />
      ) : (
        <div className="departure-image departure-image-placeholder" aria-hidden="true">
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>
      )}

      <div className="departure-copy">
        <span className="status-label">{status_label}</span>
        <h3 id={titleId}>{itinerary.title}</h3>
        <p>{itinerary.description}</p>
      </div>

      <details className="departure-details">
        <summary className="button-link button-outline">
          Detalhes da viagem
          <svg className="icon details-arrow" aria-hidden="true" viewBox="0 0 24 24">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </summary>
        {starts_at ? (
          <p>
            Saída prevista para{' '}
            <time dateTime={starts_at}>{departureDate.format(new Date(starts_at))}</time>.
          </p>
        ) : (
          <p>Divulgaremos a data, os horários e os embarques quando a saída estiver definida.</p>
        )}
      </details>
    </article>
  )
}

export default function UpcomingDepartures() {
  const [state, setState] = useState<DepartureState>({ phase: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadDepartures() {
      try {
        const response = await fetch('/api/departures/upcoming/', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Falha ao consultar as saídas.')

        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every(isDeparture)) {
          throw new Error('Resposta de saídas inválida.')
        }

        if (!controller.signal.aborted) setState({ phase: 'ready', departures: data })
      } catch {
        if (!controller.signal.aborted) setState({ phase: 'error' })
      }
    }

    void loadDepartures()
    return () => controller.abort()
  }, [])

  return (
    <section
      className="container departures"
      id="proximas-saidas"
      aria-labelledby="titulo-saidas"
      tabIndex={-1}
    >
      <h2 className="section-label" id="titulo-saidas">Próximas saídas</h2>

      {state.phase === 'loading' && (
        <p className="departure-message" role="status">Carregando próximas saídas…</p>
      )}
      {state.phase === 'error' && (
        <p className="departure-message" role="status">
          Não foi possível carregar as saídas. Atualize a página para tentar novamente.
        </p>
      )}
      {state.phase === 'ready' && (
        state.departures.length === 0 ? (
          <p className="departure-message" role="status">
            Ainda não há próximas saídas publicadas.
          </p>
        ) : (
          state.departures.map((departure) => (
            <DepartureCard key={departure.id} departure={departure} />
          ))
        )
      )}
    </section>
  )
}
