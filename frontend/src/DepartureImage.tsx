import basilicaAparecida from './assets/basilica-aparecida.webp'

type DepartureImageProps = {
  slug: string
  className: string
}

export default function DepartureImage({ slug, className }: DepartureImageProps) {
  return slug === 'aparecida' ? (
    <img
      className={className}
      src={basilicaAparecida}
      alt="Vista da Basílica de Nossa Senhora Aparecida"
      width={840}
      height={560}
      decoding="async"
    />
  ) : (
    <div className={`${className} departure-image-placeholder`} aria-hidden="true">
      <svg className="icon" viewBox="0 0 24 24">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    </div>
  )
}
