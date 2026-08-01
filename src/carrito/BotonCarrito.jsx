import { useCarrito } from './contexto'
import { IconoBolsa } from '../components/Iconos'

/** Disparador del cajón del carrito. El pictograma vive en `Iconos`. */
export default function BotonCarrito({ className = '' }) {
  const { piezas, abrir } = useCarrito()

  return (
    <button
      type="button"
      onClick={abrir}
      className={`flex items-center gap-2.5 text-grafia/72 transition-colors duration-300 hover:text-grafia ${className}`}
      aria-label={
        piezas === 0
          ? 'Su carrito, vacío'
          : `Su carrito, ${piezas} ${piezas === 1 ? 'pieza' : 'piezas'}`
      }
    >
      <IconoBolsa />
      <span className="versalita hidden text-menor sm:inline">Carrito</span>
      <span
        className="troquel text-nota text-acento"
        aria-hidden="true"
        style={{ minWidth: '1ch' }}
      >
        {piezas > 0 ? piezas : ''}
      </span>
    </button>
  )
}
