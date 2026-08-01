import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCarrito } from './contexto'
import { COLORWAYS } from '../data/productos'
import { IMG_PRODUCTO, juegoDeFotos } from '../data/imagenes'
import Rombo from '../components/Rombo'

const FOCALIZABLES =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

/**
 * Cajón del carrito. SOLO UI: no hay checkout, ni totales, ni envío.
 *
 * El botón que cierra el flujo está deshabilitado a propósito y lo dice: en
 * una revisión de dirección de diseño, un "Pagar" que parece funcional genera
 * expectativas falsas sobre el alcance del prototipo.
 */
export default function CajonCarrito() {
  const { lineas, piezas, abierto, cerrar, quitar, cambiarCantidad, claveDeLinea } =
    useCarrito()
  const reducido = useReducedMotion()
  const panel = useRef(null)
  const disparador = useRef(null)

  // Bloqueo de scroll, foco inicial y devolución del foco al cerrar
  useEffect(() => {
    if (!abierto) return
    disparador.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const t = requestAnimationFrame(() => {
      panel.current?.querySelector(FOCALIZABLES)?.focus()
    })

    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = ''
      disparador.current?.focus?.()
    }
  }, [abierto])

  // Esc para cerrar, Tab confinado al panel
  useEffect(() => {
    if (!abierto) return

    const alPulsar = (e) => {
      if (e.key === 'Escape') {
        cerrar()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return

      const focos = [...panel.current.querySelectorAll(FOCALIZABLES)]
      if (!focos.length) return
      const primero = focos[0]
      const ultimo = focos[focos.length - 1]

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abierto, cerrar])

  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-[var(--z-dialogo)]">
          {/* Velo: no es focalizable ni se anuncia. El cierre accesible son el
              botón «Cerrar» y la tecla Esc; dejarlo como <button> lo metía en
              el recorrido de tabulación por delante del panel. */}
          <motion.div
            aria-hidden="true"
            onClick={cerrar}
            className="absolute inset-0 h-full w-full bg-lienzo/75"
            initial={reducido ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducido ? 0 : 0.35 }}
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-seleccion"
            className="absolute inset-y-0 right-0 flex w-full max-w-[27rem] flex-col border-l filete bg-lienzo"
            initial={reducido ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reducido ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reducido ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-baseline justify-between gap-6 border-b filete px-7 py-6">
              <h2 id="titulo-seleccion" className="text-mayor text-grafia">
                Su carrito
              </h2>
              <button
                type="button"
                onClick={cerrar}
                className="versalita text-nota text-grafia-suave transition-colors duration-300 hover:text-grafia"
              >
                Cerrar
              </button>
            </header>

            {lineas.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
                <Rombo className="text-acento" />
                <p className="mt-7 text-menor leading-relaxed text-grafia-suave">
                  Todavía no ha apartado ninguna pieza. Cada una se prepara a pedido y
                  sale de la casa con su número de serie.
                </p>
                <Link
                  to="/catalogo"
                  onClick={cerrar}
                  className="versalita mt-9 border-b border-acento pb-1.5 text-menor text-grafia"
                >
                  Ver las piezas
                </Link>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-[color-mix(in_oklab,var(--color-acento)_22%,transparent)] overflow-y-auto px-7">
                {lineas.map((linea) => {
                  const clave = claveDeLinea(linea)
                  const cw = COLORWAYS[linea.colorway]
                  const imagen = IMG_PRODUCTO[linea.productoId]?.colorways?.[linea.colorway]

                  return (
                    <li key={clave} className="flex gap-5 py-6">
                      {imagen && (
                        <img
                          src={juegoDeFotos(imagen.id, [120, 200, 280]).src}
                          alt=""
                          className="h-24 w-20 shrink-0 object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-base text-grafia">{linea.nombre}</p>

                        <p className="mt-1.5 flex items-center gap-2.5 text-nota text-grafia-suave">
                          <span
                            aria-hidden="true"
                            className="block h-2.5 w-2.5 rounded-[1px]"
                            style={{ backgroundColor: cw?.token }}
                          />
                          {cw?.nombre}
                        </p>

                        {linea.iniciales && (
                          <p className="mt-1 text-nota text-grafia-suave">
                            Placa grabada · {linea.iniciales}
                          </p>
                        )}

                        <p className="troquel mt-1 text-nota text-grafia-suave">{linea.codigo}</p>

                        <div className="mt-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => cambiarCantidad(clave, -1)}
                              aria-label={`Quitar una unidad de ${linea.nombre}`}
                              className="h-7 w-7 border filete text-menor text-grafia transition-colors duration-300 hover:bg-realce"
                            >
                              −
                            </button>
                            <span className="troquel text-menor text-grafia" aria-live="polite">
                              {linea.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => cambiarCantidad(clave, 1)}
                              aria-label={`Añadir una unidad de ${linea.nombre}`}
                              className="h-7 w-7 border filete text-menor text-grafia transition-colors duration-300 hover:bg-realce"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => quitar(clave)}
                            className="vinculo text-nota text-grafia-suave transition-colors duration-300 hover:text-grafia"
                          >
                            Retirar
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}

            <footer className="border-t filete px-7 py-7">
              <div className="flex items-baseline justify-between gap-6">
                <span className="versalita text-nota text-acento">
                  {piezas === 1 ? '1 pieza' : `${piezas} piezas`}
                </span>
                <span className="troquel text-menor text-grafia-suave">Precio bajo consulta</span>
              </div>

              <Link
                to="/checkout"
                onClick={cerrar}
                aria-describedby="nota-prototipo-carrito"
                className="versalita mt-6 block w-full border border-acento px-8 py-4 text-center text-menor text-grafia transition-colors duration-500 hover:bg-realce"
              >
                Continuar
              </Link>

              <p
                id="nota-prototipo-carrito"
                className="mt-4 text-nota leading-relaxed text-grafia-suave"
              >
                El flujo de pedido está completo como interfaz. No se procesa ningún pago y
                los precios son marcadores de posición.
              </p>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
