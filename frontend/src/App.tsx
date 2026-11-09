import { useRef, useState } from 'react'
import mataAtlantica from './assets/mata-atlantica.webp'
import UpcomingDepartures from './UpcomingDepartures'
import './App.css'

const navigation = [
  { href: '#proximas-saidas', label: 'Próximas saídas' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#sobre', label: 'Sobre a Zarpe' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header
        className="site-header"
        id="inicio"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="Zarpe Viagens, início">
            <strong>Zarpe</strong> Viagens
          </a>

          <button
            className="menu-toggle"
            type="button"
            ref={menuButton}
            aria-controls="menu-principal"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d={menuOpen ? 'm5 5 14 14M19 5 5 19' : 'M3 6h18M3 12h18M3 18h18'} />
            </svg>
          </button>

          <nav
            className={menuOpen ? 'site-nav is-open' : 'site-nav'}
            id="menu-principal"
            aria-label="Menu principal"
          >
            {navigation.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className="hero" aria-labelledby="titulo-principal">
          <div className="hero-copy">
            <h1 id="titulo-principal">
              <span>Seu próximo</span>{' '}
              <span>destino começa</span>{' '}
              <em>aqui.</em>
            </h1>
            <p className="hero-intro">
              Excursões de van em pequenos grupos, saindo de Itapuí e região.
              Da natureza aos destinos clássicos, descubra novos lugares com a Zarpe.
            </p>
          </div>

          <figure className="hero-figure">
            <svg className="hero-mask" aria-hidden="true" width="0" height="0">
              <defs>
                <clipPath id="recorte-foto" clipPathUnits="objectBoundingBox">
                  <path d="M.44 0H1V1C.82 .97 .62 1 .37 .98 .15 .96 0 .82 .03 .63 .05 .48 .15 .42 .18 .27 .21 .14 .31 .04 .44 0Z" />
                </clipPath>
              </defs>
            </svg>
            <img
              className="hero-image"
              src={mataAtlantica}
              alt="Vegetação da Mata Atlântica na Serra do Mar"
              width={1440}
              height={731}
              fetchPriority="high"
            />
          </figure>

          <div className="hero-actions">
            <a className="button-link button-primary" href="#proximas-saidas">
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Ver próximas saídas
            </a>
            <a className="button-link button-outline" href="#sobre">
              Sobre a Zarpe
            </a>
          </div>
        </section>

        <UpcomingDepartures />

        <section
          className="container features"
          id="como-funciona"
          aria-label="Como funciona"
          tabIndex={-1}
        >
          <ul className="features-list">
            <li>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M2 17v-5l2-6h12l5 5v6h-2m-4 0H9m-4 0H2m4-7h4m3 0h3l2 2h-5z" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              Viagem em van
            </li>
            <li>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Saída de Itapuí e região
            </li>
            <li>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5" />
              </svg>
              Reserva sem cadastro
            </li>
          </ul>
        </section>

        <section className="about" id="sobre" aria-labelledby="titulo-sobre" tabIndex={-1}>
          <svg
            className="about-wave"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 9C145 54 186 15 313 33c98 13 148 15 255 15h370c177 0 218-46 345-26 83 13 111 0 157-22v48H0Z" />
          </svg>
          <div className="container about-inner">
            <div>
              <p className="section-label">Sobre a Zarpe</p>
              <h2 id="titulo-sobre">Uma viagem de cada vez</h2>
            </div>
            <div className="about-copy">
              <p>
                A Zarpe nasce em Itapuí com a ideia de organizar excursões em
                pequenos grupos, dos destinos clássicos às trilhas, cavernas e
                outros passeios na natureza.
              </p>
              <p>
                Quando uma saída estiver disponível, você poderá reservar pelo
                site sem precisar criar uma conta.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="brand footer-brand">
            <strong>Zarpe</strong> Viagens
          </p>
          <p className="photo-credits">
            Fotos:{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Mata_Atl%C3%A2ntica_Ao_redor_da_R._Oswaldo_Cruz_1.jpg">
              Themium
            </a>{' '}
            (<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>)
            {' · '}
            <a href="https://commons.wikimedia.org/wiki/File:Vista_da_Bas%C3%ADlica_de_Nossa_Senhora_Aparecida,_Aparecida_SP.JPG">
              HVL
            </a>{' '}
            (<a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>).
            Imagens redimensionadas, com recorte na exibição.
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
