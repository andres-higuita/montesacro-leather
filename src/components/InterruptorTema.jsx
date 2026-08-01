import { motion, useReducedMotion } from 'motion/react'
import { useTema } from '../tema/contexto'

/**
 * Selector de fondo. HERRAMIENTA DE REVISIÓN.
 *
 * Control segmentado, no un riel con pomo: un switch mudo no dice qué alterna.
 * Las dos opciones llevan su palabra visible y una pastilla se desliza bajo la
 * activa, así que se lee a la vez como interruptor y como etiqueta.
 *
 * Dice "Claro / Oscuro" y no "Arcilla / Piel" a propósito: es una herramienta
 * para revisar el prototipo, y ahí la claridad vale más que la voz de marca.
 * Los nombres de marca viven en el `title`.
 *
 * No es parte del producto: cuando se elija una dirección, se borra este
 * componente, sus usos en `Encabezado` y el proveedor `src/tema/`.
 */
const OPCIONES = [
  { id: 'arcilla', texto: 'Claro', marca: 'Arcilla' },
  { id: 'piel', texto: 'Oscuro', marca: 'Piel' },
]

export default function InterruptorTema({ className = '' }) {
  const { tema, cambiar } = useTema()
  const reducido = useReducedMotion()

  return (
    <div
      className={`inline-flex items-center rounded-full border filete p-[3px] ${className}`}
      role="group"
      aria-label="Fondo del prototipo"
    >
      {OPCIONES.map((o) => {
        const activa = tema === o.id

        return (
          <button
            key={o.id}
            type="button"
            onClick={() => cambiar(o.id)}
            aria-pressed={activa}
            title={`Fondo ${o.texto.toLowerCase()} · ${o.marca}`}
            className="relative rounded-full px-3.5 py-1.5"
          >
            {activa && (
              <motion.span
                layoutId="pastilla-tema"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-realce"
                transition={
                  reducido ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                }
              />
            )}
            <span
              className={`versalita relative text-nota transition-colors duration-300 ${
                activa ? 'text-grafia' : 'text-grafia/70 hover:text-grafia'
              }`}
            >
              {o.texto}
            </span>
          </button>
        )
      })}
    </div>
  )
}
