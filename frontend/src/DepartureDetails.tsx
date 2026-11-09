import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import DepartureImage from './DepartureImage'
import { isDeparture, type Departure } from './departure'
import './DepartureDetails.css'

type DepartureDetail = Departure & {
  itinerary: Departure['itinerary'] & { program: string }
  price_per_person: string | null
  boarding_points: string
}

type DetailState =
  | { phase: 'loading' | 'unavailable' | 'error' }
  | { phase: 'ready'; departure: DepartureDetail }

const messages = {
  loading: 'Carregando detalhes da saída…',
  unavailable: 'Esta saída está indisponível no momento.',
  error: 'Não foi possível carregar esta saída. Atualize a página para tentar novamente.',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function isDepartureDetail(value: unknown): value is DepartureDetail {
  if (!isDeparture(value)) return false
  const detail = value as Partial<DepartureDetail>

  return (
    typeof detail.itinerary?.program === 'string' &&
    typeof detail.boarding_points === 'string' &&
    (detail.price_per_person === null ||
      (typeof detail.price_per_person === 'string' &&
        /^\d+(\.\d{1,2})?$/.test(detail.price_per_person)))
  )
}

function DepartureContent({ departure }: { departure: DepartureDetail }) {
  const { itinerary, status_label, starts_at, price_per_person, boarding_points } = departure
  const program = itinerary.program.trim()
  const points = boarding_points.split(/\r?\n/).map((point) => point.trim()).filter(Boolean)

  return (
    <>
      <div className="departure-page-intro">
        <div>
          <span className="status-label">{status_label}</span>
          <h1>{itinerary.title}</h1>
          <p>{itinerary.description}</p>
        </div>
        <DepartureImage slug={itinerary.slug} className="departure-page-photo" />
      </div>

      <dl className="departure-page-facts">
        <div>
          <dt>Data e horário</dt>
          <dd>
            {starts_at
              ? <time dateTime={starts_at}>{dateFormatter.format(new Date(starts_at))}</time>
              : 'A definir'}
          </dd>
        </div>
        <div>
          <dt>Preço por pessoa</dt>
          <dd>{price_per_person === null ? 'A definir' : priceFormatter.format(Number(price_per_person))}</dd>
        </div>
      </dl>

      <div className="departure-page-information">
        <section>
          <h2>Programação</h2>
          <p className="departure-program">{program || 'Programação a definir.'}</p>
        </section>
        <section>
          <h2>Pontos de embarque</h2>
          {points.length > 0 ? (
            <ul>{points.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul>
          ) : (
            <p>Pontos de embarque a definir.</p>
          )}
        </section>
      </div>
    </>
  )
}

function DepartureDetailsContent({ departureId }: { departureId: string }) {
  const [state, setState] = useState<DetailState>({ phase: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadDeparture() {
      try {
        const response = await fetch(`/api/departures/${departureId}/`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        if (response.status === 404) {
          setState({ phase: 'unavailable' })
          return
        }
        if (!response.ok) throw new Error('Falha ao consultar a saída.')

        const departure: unknown = await response.json()
        if (!isDepartureDetail(departure)) throw new Error('Detalhe de saída inválido.')
        if (!controller.signal.aborted) setState({ phase: 'ready', departure })
      } catch {
        if (!controller.signal.aborted) setState({ phase: 'error' })
      }
    }

    void loadDeparture()
    return () => controller.abort()
  }, [departureId])

  if (state.phase === 'ready') return <DepartureContent departure={state.departure} />

  return <DetailMessage phase={state.phase} />
}

function DetailMessage({ phase }: { phase: keyof typeof messages }) {
  return (
    <>
      <h1>Detalhes da viagem</h1>
      <p className="departure-message" role="status">{messages[phase]}</p>
    </>
  )
}

export default function DepartureDetails() {
  const { departureId } = useParams()

  return (
    <section className="container departure-page">
      <a className="departure-back" href="/#proximas-saidas">Voltar às próximas saídas</a>
      {departureId && /^[1-9]\d{0,18}$/.test(departureId) ? (
        <DepartureDetailsContent key={departureId} departureId={departureId} />
      ) : (
        <DetailMessage phase="unavailable" />
      )}
    </section>
  )
}
