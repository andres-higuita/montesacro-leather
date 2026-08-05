import { Link } from 'react-router-dom'
import SelectorColor from '../SelectorColor'
import PersonalizacionCompacta from '../PersonalizacionCompacta'
import Rombo from '../Rombo'
import { MonogramaEnrombo } from '../Monograma'
import { COLORWAYS } from '../../data/productos'

/**
 * El bloque de compra, al final del recorrido.
 *
 * En la ficha anterior la compra iba arriba, al lado de la galería. Aquí baja
 * al final a propósito: el recorrido es el argumento y esto es su conclusión.
 * Quien ya sabe lo que quiere no tiene que bajarlo entero — la barra fijada
 * lleva el botón de añadir desde que termina la portada.
 *
 * Dos columnas: la elección a la izquierda, lo que llega a casa a la derecha.
 */
export default function ConfiguraPieza({
  producto,
  colorway,
  alCambiarPiel,
  codigo,
  precio,
  placaActiva,
  alAlternarPlaca,
  uno,
  dos,
  alCambiarUno,
  alCambiarDos,
  alAnadir,
  id,
}) {
  return (
    <section id={id} className="border-t border-marfil/10 bg-black py-[clamp(4rem,10vw,8rem)]">
      <div className="canal">
        <p className="versalita text-nota text-oro">Su pieza</p>
        <h2 className="mt-6 max-w-[20ch] font-[family-name:var(--font-display)] text-portada leading-[1.06] text-marfil">
          Configúrela y quedará registrada
        </h2>

        <div className="mt-[clamp(2.5rem,6vw,4rem)] grid gap-x-20 gap-y-14 lg:grid-cols-[1fr_0.85fr]">
          {/* Elección */}
          <div>
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-oro/34 pb-6">
              <p className="troquel text-mayor text-marfil">{precio}</p>
              <p className="troquel text-nota text-humo" aria-live="polite">
                Ref. {codigo}
              </p>
              <p className="text-nota text-humo">Piel · {COLORWAYS[colorway]?.nombre}</p>
            </div>

            <SelectorColor
              className="mt-10"
              colorways={producto.colorways}
              activo={colorway}
              alCambiar={alCambiarPiel}
            />

            <PersonalizacionCompacta
              className="mt-12 border-t border-oro/34 pt-9"
              activa={placaActiva}
              alAlternar={alAlternarPlaca}
              uno={uno}
              dos={dos}
              alCambiarUno={alCambiarUno}
              alCambiarDos={alCambiarDos}
            />

            <button
              type="button"
              onClick={alAnadir}
              className="versalita mt-11 w-full border border-oro px-8 py-4.5 text-menor text-marfil transition-colors duration-500 hover:bg-vino"
            >
              Añadir al carrito
            </button>

            <p className="mt-4 text-nota leading-relaxed text-humo">
              Prototipo de diseño: el pedido se puede recorrer completo, pero no se procesa
              ningún pago y los precios son marcadores de posición.
            </p>
          </div>

          {/* Lo que llega */}
          <div>
            <div className="flex gap-6 border-t border-oro/34 pt-9">
              <MonogramaEnrombo size={44} className="mt-0.5 shrink-0 text-oro" />
              <div>
                <p className="text-menor text-marfil">
                  Incluye certificado de autenticidad numerado
                </p>
                <p className="mt-2 text-nota leading-relaxed text-humo">
                  Cartulina de algodón de 700 g/m², impresa en letterpress, con un número de
                  serie único que queda en el registro de la casa.{' '}
                  <Link to="/experiencia#autenticidad" className="vinculo text-marfil/85">
                    Cómo funciona
                  </Link>
                </p>
              </div>
            </div>

            <ul className="mt-10 space-y-3.5 border-t border-oro/34 pt-9">
              {producto.empaque.map((linea) => (
                <li key={linea} className="flex items-center gap-3.5 text-menor text-humo">
                  <Rombo size={5} className="text-oro" />
                  {linea}
                </li>
              ))}
            </ul>

            <Link
              to="/experiencia"
              className="versalita mt-10 inline-block border-b border-oro pb-1.5 text-menor text-marfil transition-colors duration-400 hover:text-oro"
            >
              Cómo llega a sus manos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
