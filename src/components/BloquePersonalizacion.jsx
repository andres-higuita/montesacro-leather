import { useId, useState } from 'react'
import { PLACA } from '../data/productos'
import PlacaIniciales from './PlacaIniciales'
import { soloLetra } from '../lib/texto'

/**
 * Personalización a página completa (página de la experiencia).
 *
 * La versión que vive dentro de la columna de compra es
 * `PersonalizacionCompacta`; ambas comparten la vista previa `PlacaIniciales`.
 *
 * Consume roles de color, así que funciona en cualquier tema o mundo sin
 * recibir una sola prop de apariencia.
 *
 * Prototipo: no persiste ni envía nada.
 */
export default function BloquePersonalizacion({ className = '' }) {
  const [uno, setUno] = useState('A')
  const [dos, setDos] = useState('B')
  const id = useId()

  return (
    <div className={`grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20 ${className}`}>
      <div>
        <PlacaIniciales uno={uno} dos={dos} className="mx-auto" />
        <p className="mt-5 text-center text-nota text-grafia-suave">
          Vista previa. El grabado definitivo se hace en bajo relieve o en dorado.
        </p>
      </div>

      <div>
        <h3 className="text-titulo text-grafia">Sus iniciales, en bajo relieve</h3>

        <p className="prosa mt-5 text-grafia-suave">
          Toda pieza puede llevar una placa de cuero grabada con dos iniciales. Se entrega
          dentro de su propia bolsita de algodón, junto a la tarjeta de autenticidad.
        </p>

        <div className="mt-9 flex items-end gap-5">
          {[
            { valor: uno, set: setUno, etiqueta: 'Primera inicial' },
            { valor: dos, set: setDos, etiqueta: 'Segunda inicial' },
          ].map((campo, i) => (
            <div key={campo.etiqueta}>
              <label htmlFor={`${id}-${i}`} className="versalita block text-nota text-acento">
                {campo.etiqueta}
              </label>
              <input
                id={`${id}-${i}`}
                type="text"
                inputMode="text"
                maxLength={1}
                autoComplete="off"
                value={campo.valor}
                onChange={(e) => campo.set(soloLetra(e.target.value))}
                className="mt-3 h-16 w-16 border filete bg-transparent text-center font-[family-name:var(--font-display)] text-mayor text-grafia"
              />
            </div>
          ))}
        </div>

        <dl className="mt-11 border-t filete">
          {[
            ['Material', PLACA.material],
            ['Grabado', PLACA.grabado],
            ['Acabado', PLACA.acabado],
            ['Tamaño', PLACA.medidas],
          ].map(([clave, valor]) => (
            <div
              key={clave}
              className="flex items-baseline justify-between gap-6 border-b filete py-3"
            >
              <dt className="text-menor text-grafia-suave">{clave}</dt>
              <dd className="troquel text-right text-menor text-grafia">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
