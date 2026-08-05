import { useEffect, useRef, useState } from 'react'
import { COLORWAYS } from '../../data/productos'
import { IMG_PRODUCTO, foto } from '../../data/imagenes'

/**
 * Barra de compra de la pieza: miniatura, nombre, pieles, precio, cantidad y
 * añadir.
 *
 * Va ABAJO y no arriba. Arriba competía con la cápsula del encabezado —dos
 * barras flotantes en la misma franja— y obligaba a un bloque ancho con índice
 * de secciones para justificar el sitio que ocupaba.
 *
 * La composición es la barra de producto de MORAE, la plantilla de origen
 * (ver MAPEO-MORAE.md), traducida al idioma de la casa:
 *
 *   [foto] [nombre / pieles] [precio / ver ficha] [− n +] [Añadir]
 *
 * De MORAE se conserva el reparto —la pieza a la izquierda, el dinero y el
 * gesto a la derecha— y se cambia el acabado: cantos de 2 y 4 px en vez de los
 * 10 px de la plantilla, Marcellus en el nombre, troquel en las cifras y el oro
 * de la marca donde MORAE pone naranja. La barra deja de ser un recordatorio y
 * pasa a ser el punto de compra: desde aquí se elige piel, cantidad y se añade
 * sin volver al configurador.
 *
 * Aparece al terminar la portada y no antes: sobre el hero competiría con el
 * nombre a tamaño de portada, que es justo lo que la barra viene a sustituir
 * cuando ese nombre ya salió de pantalla. Y se retira al llegar al final, para
 * no quedarse encima del pie de página.
 */
export default function BarraPieza({
  producto,
  precio,
  codigo,
  colorway,
  alCambiarPiel,
  alAnadir,
}) {
  const centinela = useRef(null)
  const [visible, setVisible] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    const nodo = centinela.current
    if (!nodo) return

    /* El centinela vive al final de la portada: cuando llega arriba, la barra
       entra. Se mide con un listener de scroll y no con un IntersectionObserver
       porque el observador no reparte entregas en pestañas ocultas o
       ralentizadas y la barra se quedaba apagada al volver a ellas. La lectura
       va dentro de un rAF: una por fotograma, no una por muesca de rueda. */
    let pendiente = false

    const medir = () => {
      pendiente = false
      const empezado = nodo.getBoundingClientRect().top <= 96
      // Los últimos 320 px son el pie: ahí la barra sobra y estorba.
      const enElPie =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 320
      setVisible(empezado && !enElPie)
    }

    const alDesplazar = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    window.addEventListener('resize', alDesplazar)
    return () => {
      window.removeEventListener('scroll', alDesplazar)
      window.removeEventListener('resize', alDesplazar)
    }
  }, [])

  // La miniatura es la toma cerrada de la piel elegida, la misma que enseña el
  // bloque de pieles: al cambiar de piel arriba, la barra cambia con ella.
  const toma = IMG_PRODUCTO[producto.id]?.colorways?.[colorway]

  const anadir = () => {
    alAnadir(cantidad)
    // La cantidad no se conserva entre añadidos: el cajón del carrito ya la
    // muestra y dejarla en 3 hace que el siguiente clic añada tres sin querer.
    setCantidad(1)
  }

  return (
    <>
      <div ref={centinela} aria-hidden="true" className="h-px w-full" />

      {/* `fixed` y no `sticky`: pegado al borde inferior de la ventana durante
          toda la ficha, sin depender de dónde esté su hueco en el flujo.
          El contenedor no intercepta el ratón —solo la barra—, así que el
          resto de la franja baja de la pantalla sigue siendo del recorrido. */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[var(--z-pegajoso)] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-[var(--ease-salida)] sm:px-6 sm:pb-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
      >
        {/* La sombra larga y muy difusa despega la barra del recorrido que pasa
            por detrás: sin ella, sobre los fotogramas claros del scrub se
            confundía con la imagen. */}
        <div className="pointer-events-auto flex w-full max-w-[54rem] flex-wrap items-center gap-x-4 gap-y-3 rounded-panel border border-marfil/14 bg-black/80 p-2.5 shadow-[0_24px_70px_-26px_rgba(0,0,0,0.95)] backdrop-blur-[14px] sm:gap-x-5">
          {/* ── La pieza: foto, nombre y pieles ─────────────────────── */}
          {/* `basis-full` en teléfono: sin él, el bloque de la pieza se encoge
              hasta que el nombre queda en tres letras antes de que nada baje de
              fila. Con la base al ancho completo, precio, cantidad y botón
              caen a una segunda fila y el nombre se lee entero. */}
          <div className="flex min-w-0 flex-1 basis-full items-center gap-4 sm:basis-auto">
            {toma && (
              <img
                src={foto(toma.id, 200)}
                alt={toma.alt}
                loading="lazy"
                decoding="async"
                /* Apaisada y no cuadrada: las tomas de estudio son 3:2 con la
                   pieza llenando el encuadre, y un recorte cuadrado se queda en
                   la textura del centro —piel negra sobre piel negra— sin
                   silueta que reconocer. */
                className="h-14 w-[5.25rem] shrink-0 rounded-ficha border border-marfil/15 object-cover sm:h-16 sm:w-24"
              />
            )}

            <div className="min-w-0">
              <p className="flex min-w-0 items-baseline gap-2.5 font-[family-name:var(--font-display)] text-medio leading-tight text-marfil sm:text-mayor">
                <span className="truncate">{producto.nombre}</span>
                {/* La referencia es dato de ficha, no de titular: va en troquel,
                    en humo y solo cuando hay ancho para ella. */}
                <span className="troquel hidden shrink-0 text-nota text-humo lg:inline">
                  {codigo}
                </span>
              </p>

              {/* Las pieles, como en MORAE: nombres en fila, la elegida en oro.
                  En teléfono no caben cuatro nombres largos —«Verde botella» ya
                  se come media barra—, así que ahí se reducen a la muestra de
                  color y el nombre vuelve desde `sm`. */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {producto.colorways.map((id) => {
                  const piel = COLORWAYS[id]
                  const activa = id === colorway
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => alCambiarPiel(id)}
                      aria-pressed={activa}
                      title={piel.nombre}
                      className={`flex shrink-0 items-center gap-1.5 text-nota leading-none transition-colors duration-300 ${
                        activa ? 'text-oro' : 'text-humo hover:text-marfil'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`block size-3 rounded-full border transition-colors duration-300 sm:hidden ${
                          activa ? 'border-oro' : 'border-marfil/25'
                        }`}
                        style={{ background: piel.token }}
                      />
                      <span className="hidden sm:inline">{piel.nombre}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── El dato: precio y salida a la ficha técnica ──────────── */}
          <div className="shrink-0 text-right">
            <p className="troquel text-menor leading-tight text-marfil sm:text-base">{precio}</p>
            <a
              href="#ficha"
              className="mt-1.5 block text-nota leading-none text-humo underline decoration-marfil/30 underline-offset-4 transition-colors duration-300 hover:text-marfil"
            >
              Ver la ficha
            </a>
          </div>

          {/* ── Cantidad ─────────────────────────────────────────────
              El carrito ya sabe sumar unidades de la misma línea; esto solo
              evita tener que pulsar `Añadir` tres veces. */}
          <div className="flex shrink-0 items-center rounded-ficha border border-marfil/14 bg-marfil/5">
            <button
              type="button"
              onClick={() => setCantidad((n) => Math.max(1, n - 1))}
              disabled={cantidad === 1}
              aria-label="Quitar una unidad"
              className="px-3 py-3 text-menor leading-none text-humo transition-colors duration-300 hover:text-marfil disabled:opacity-35 disabled:hover:text-humo"
            >
              −
            </button>
            <span
              aria-live="polite"
              className="troquel min-w-6 text-center text-menor leading-none text-marfil"
            >
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => setCantidad((n) => Math.min(9, n + 1))}
              disabled={cantidad === 9}
              aria-label="Añadir una unidad"
              className="px-3 py-3 text-menor leading-none text-humo transition-colors duration-300 hover:text-marfil disabled:opacity-35 disabled:hover:text-humo"
            >
              +
            </button>
          </div>

          {/* ── El gesto ─────────────────────────────────────────────
              Único elemento con relleno de toda la barra. En teléfono crece
              hasta ocupar lo que sobre de la fila. */}
          <button
            type="button"
            onClick={anadir}
            className="versalita shrink-0 grow rounded-ficha border border-oro bg-vino px-6 py-4 text-menor tracking-[0.08em] text-marfil transition-colors duration-500 hover:bg-vino-hondo sm:grow-0 sm:px-9 sm:text-base"
          >
            Añadir
          </button>
        </div>
      </div>
    </>
  )
}
