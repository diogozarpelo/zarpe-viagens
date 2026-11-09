import { useEffect, useState } from 'react'
import DepartureImage from './DepartureImage'
import { isDeparture, type Departure } from './departure'

type DepartureState =
  | { phase: 'loading' }
  | { phase: 'ready'; departures: Departure[] }
  | { phase: 'error' }

function DepartureCard({ departure }: { departure: Departure }) {
  const { id, itinerary, status_label } = departure
  const titleId = `titulo-saida-${id}`

  return (
    <article className="departure-card" aria-labelledby={titleId}>
      <DepartureImage slug={itinerary.slug} className="departure-image" />

      <div className="departure-copy">
        <span className="status-label">{status_label}</span>
        <h3 id={titleId}>{itinerary.title}</h3>
        <p>{itinerary.description}</p>
      </div>

      <div className="departure-details">
        <a className="button-link button-outline" href={`/saidas/${id}`}>
          Detalhes da viagem
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </a>
      </div>
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
