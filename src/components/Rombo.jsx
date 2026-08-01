/**
 * Rombo de filete. Único ornamento del sistema, heredado del collection book,
 * donde separa el wordmark de la divisa. Se usa como remate de sección.
 */
export default function Rombo({ size = 7, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block rotate-45 border border-current opacity-55 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

/** Filete horizontal con rombo al centro. Remate de sección. */
export function FileteConRombo({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-25" />
      <Rombo />
      <span className="h-px flex-1 bg-current opacity-25" />
    </div>
  )
}
