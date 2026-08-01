import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { COLORWAYS } from '../data/productos'
import { useCarrito } from '../carrito/contexto'
import { MonogramaEnrombo } from '../components/Monograma'
import Reveal from '../components/Reveal'
import Rombo, { FileteConRombo } from '../components/Rombo'
import { useMundoDeCabecera } from '../tema/cabecera'

/**
 * Cierre del flujo.
 *
 * Recibe el pedido por el estado de navegación: si alguien recarga o entra
 * directo, no hay nada que mostrar y vuelve al catálogo. Es lo correcto para un
 * prototipo sin backend — inventar un pedido al recargar sería peor.
 *
 * La pantalla no dice "gracias por su compra": dice qué pasa ahora y cuál es el
 * número de cada pieza. En esta casa el número de serie es la confirmación.
 */
export default function Confirmacion() {
  const { state } = useLocation()
  const { vaciar } = useCarrito()
  const pedido = state?.pedido

  useMundoDeCabecera('vino')

  // El carrito se vacía aquí y no al confirmar: si se vaciara en el checkout,
  // su propia guarda de carrito vacío lo mandaría al catálogo a mitad de la
  // navegación. `pedido` ya es una copia, así que vaciar no afecta a esta vista.
  useEffect(() => {
    if (pedido) vaciar()
  }, [pedido, vaciar])

  if (!pedido) return <Navigate to="/catalogo" replace />

  const { datos, lineas, numero } = pedido
  const alTaller = datos.modoEntrega === 'taller'

  return (
    <>
      <section className="mundo-vino pt-[clamp(7.5rem,14vw,11rem)] pb-[clamp(4rem,9vw,7rem)]">
        <div className="canal">
          <Reveal className="mx-auto max-w-[46rem] text-center">
            <MonogramaEnrombo size={58} className="mx-auto text-acento" />

            <h1 className="mt-8 text-portada text-grafia">Su pedido quedó registrado</h1>

            <p className="troquel mt-6 text-mayor text-acento">{numero}</p>

            <p className="prosa mx-auto mt-8 text-grafia/75">
              {datos.nombre}, le enviamos la confirmación a{' '}
              <span className="text-grafia">{datos.email}</span>.{' '}
              {alTaller
                ? 'Le escribimos dentro de las próximas 24 horas para acordar la cita en el taller.'
                : 'Le escribiremos cuando la pieza entre a producción y otra vez cuando salga del taller.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Las piezas, cada una con su número ─────────────────────────── */}
      <section className="canal py-[clamp(4.5rem,10vw,8rem)]">
        <Reveal>
          <h2 className="text-titulo text-grafia">Sus piezas</h2>
          <p className="prosa mt-5 text-grafia-suave">
            Cada una lleva su propio número de serie, grabado en la tarjeta de
            autenticidad y guardado en el registro de la casa. Ese número permite
            verificarla, repararla y acreditar su procedencia años después.
          </p>
        </Reveal>

        <ul className="mt-11 border-t filete">
          {lineas.map((linea, i) => (
            <Reveal as="li" key={`${linea.codigo}-${linea.serie}`} indice={i}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b filete py-6">
                <div>
                  <p className="text-mayor text-grafia">{linea.nombre}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-nota text-grafia-suave">
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="block h-2.5 w-2.5 rounded-[1px]"
                        style={{ backgroundColor: COLORWAYS[linea.colorway]?.token }}
                      />
                      {COLORWAYS[linea.colorway]?.nombre}
                    </span>
                    <span className="troquel">{linea.codigo}</span>
                    {linea.iniciales && <span>Placa grabada · {linea.iniciales}</span>}
                  </p>
                </div>

                <p className="troquel text-menor text-acento">N° {linea.serie}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Qué pasa ahora ─────────────────────────────────────────────── */}
      <section className="mundo-contra py-[clamp(4.5rem,10vw,8rem)]">
        <div className="canal">
          <Reveal>
            <h2 className="text-titulo text-grafia">Qué pasa ahora</h2>
          </Reveal>

          <ol className="mt-10 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                'Corte',
                'Elegimos y cortamos la piel. Es el paso que define el patrón de escamas de su pieza.',
              ],
              [
                'Taller',
                'Costura a mano, cantos pintados y pulidos, montaje del cierre y de la placa.',
              ],
              [
                'Registro',
                'Se emite la tarjeta de autenticidad con su número y se archiva en el registro.',
              ],
              [
                alTaller ? 'Cita' : 'Envío',
                alTaller
                  ? 'Le entregamos la pieza en persona y revisamos juntos el grabado.'
                  : 'Sale en su caja rígida, con seguimiento y firma en la entrega.',
              ],
            ].map(([titulo, texto], i) => (
              <Reveal as="li" key={titulo} indice={i}>
                <p className="troquel text-nota text-acento">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-mayor text-grafia">
                  {titulo}
                </p>
                <p className="mt-2.5 text-nota leading-relaxed text-grafia-suave">{texto}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-12 flex items-start gap-3.5 border-t filete pt-7">
            <Rombo size={5} className="mt-2 shrink-0 text-acento" />
            <p className="text-nota leading-relaxed text-grafia-suave">
              Preparación estimada: de 3 a 5 semanas. Prototipo de diseño: no se procesó
              ningún pago y este pedido no existe en ningún sistema.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="canal py-[clamp(4rem,9vw,7rem)] text-center">
        <FileteConRombo className="text-grafia" />
        <Link
          to="/catalogo"
          className="versalita mt-10 inline-block border-b border-acento pb-1.5 text-menor text-grafia transition-colors duration-400 hover:text-acento"
        >
          Volver a las piezas
        </Link>
      </section>
    </>
  )
}
