/**
 * Wordmark MONTESACRO con su bajada.
 * Escala por `tono` de tamaño; nunca lleva peso bold (Marcellus no lo tiene).
 */
const TAMANOS = {
  pie: { marca: 'text-[0.95rem]', track: '0.34em', bajada: 'text-[0.5rem]', gap: 'mt-1.5' },
  nav: { marca: 'text-[1.05rem]', track: '0.36em', bajada: 'text-[0.5rem]', gap: 'mt-1.5' },
  portada: { marca: 'text-[1.6rem]', track: '0.42em', bajada: 'text-[0.6rem]', gap: 'mt-3' },
}

export default function Logotipo({ tamano = 'nav', bajada = true, className = '' }) {
  const t = TAMANOS[tamano] ?? TAMANOS.nav

  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className={`font-[family-name:var(--font-display)] ${t.marca}`}
        style={{ letterSpacing: t.track, marginRight: `-${t.track}` }}
      >
        MONTESACRO
      </span>
      {bajada && (
        <span
          className={`${t.bajada} ${t.gap} font-[family-name:var(--font-cuerpo)] font-normal opacity-75`}
          style={{ letterSpacing: '0.5em', marginRight: '-0.5em' }}
        >
          LEATHER GOODS
        </span>
      )}
    </span>
  )
}
