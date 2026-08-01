import { useId } from 'react'
import PlacaIniciales from './PlacaIniciales'
import { soloLetra } from '../lib/texto'

/**
 * Personalización dentro de la columna de compra.
 *
 * Es opcional y arranca apagada: la mayoría de las piezas salen sin placa, y
 * poner los campos siempre activos sugeriría lo contrario. Al activarla, la
 * placa aparece con la vista previa en vivo.
 *
 * Estado controlado por la ficha de producto, que necesita las iniciales para
 * añadirlas a la línea de la selección.
 */
export default function PersonalizacionCompacta({
  activa,
  alAlternar,
  uno,
  dos,
  alCambiarUno,
  alCambiarDos,
  className = '',
}) {
  const id = useId()

  return (
    <div className={className}>
      <div className="flex items-start gap-3.5">
        <input
          id={`${id}-activa`}
          type="checkbox"
          checked={activa}
          onChange={(e) => alAlternar(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-acento)]"
        />
        <label htmlFor={`${id}-activa`} className="text-menor text-grafia">
          Añadir placa de cuero con iniciales
          <span className="mt-1 block text-nota text-grafia-suave">
            Grabado en bajo relieve o estampado en dorado. Sin costo adicional.
          </span>
        </label>
      </div>

      {activa && (
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-6">
          <div className="flex items-end gap-4">
            {[
              { valor: uno, set: alCambiarUno, etiqueta: 'Primera' },
              { valor: dos, set: alCambiarDos, etiqueta: 'Segunda' },
            ].map((campo, i) => (
              <div key={campo.etiqueta}>
                <label
                  htmlFor={`${id}-inicial-${i}`}
                  className="versalita block text-nota text-acento"
                >
                  {campo.etiqueta}
                </label>
                <input
                  id={`${id}-inicial-${i}`}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  autoComplete="off"
                  value={campo.valor}
                  onChange={(e) => campo.set(soloLetra(e.target.value))}
                  className="mt-2.5 h-14 w-14 border filete bg-transparent text-center font-[family-name:var(--font-display)] text-mayor text-grafia"
                />
              </div>
            ))}
          </div>

          <PlacaIniciales uno={uno} dos={dos} tamano="compacta" />
        </div>
      )}
    </div>
  )
}
