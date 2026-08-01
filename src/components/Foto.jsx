import { juegoDeFotos } from '../data/imagenes'

/**
 * Envoltura de <img>. Centraliza srcset, lazy loading y encuadre.
 * Recibe el objeto {id, alt} de src/data/imagenes.js, nunca una URL suelta.
 */
export default function Foto({
  imagen,
  ratio = '4 / 5',
  sizes = '(min-width: 64rem) 50vw, 100vw',
  prioridad = false,
  className = '',
  imgClassName = '',
  anchos,
}) {
  if (!imagen) return null
  const { src, srcSet } = juegoDeFotos(imagen.id, anchos)

  return (
    <div
      className={`relative overflow-hidden bg-lienzo-alto ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={imagen.alt}
        loading={prioridad ? 'eager' : 'lazy'}
        fetchPriority={prioridad ? 'high' : 'auto'}
        decoding={prioridad ? 'sync' : 'async'}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}
