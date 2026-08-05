import { useEffect, useRef, useState } from 'react'

/**
 * Barra de compra de la pieza: nombre, precio, referencia y añadir.
 *
 * Va ABAJO y no arriba. Arriba competía con la cápsula del encabezado —dos
 * barras flotantes en la misma franja— y obligaba a un bloque ancho con índice
 * de secciones para justificar el sitio que ocupaba. Aquí es una píldora
 * estrecha, centrada, del ancho de su contenido: el recorrido de la ficha manda
 * en toda la pantalla y la compra espera abajo sin pedir turno.
 *
 * El índice de capítulos (`El recorrido`, `Las pieles`, `Ficha técnica`) se
 * quitó con la mudanza: la ficha se lee de arriba abajo y quien la recorre ya
 * pasa por las tres. Las anclas siguen existiendo en las secciones, así que las
 * URLs con `#recorrido` no se han roto.
 *
 * Aparece al terminar la portada y no antes: sobre el hero competiría con el
 * nombre a tamaño de portada, que es justo lo que la barra viene a sustituir
 * cuando ese nombre ya salió de pantalla. Y se retira al llegar al final, para
 * no quedarse encima del pie de página.
 */
export default function BarraPieza({ producto, precio, codigo, alAnadir }) {
  const centinela = useRef(null)
  const [visible, setVisible] = useState(false)

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

  return (
    <>
      <div ref={centinela} aria-hidden="true" className="h-px w-full" />

      {/* `fixed` y no `sticky`: pegado al borde inferior de la ventana durante
          toda la ficha, sin depender de dónde esté su hueco en el flujo.
          El contenedor no intercepta el ratón —solo la píldora—, así que el
          resto de la franja baja de la pantalla sigue siendo del recorrido. */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[var(--z-pegajoso)] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-[var(--ease-salida)] ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <div className="pointer-events-auto flex max-w-full items-center gap-4 rounded-panel border border-marfil/12 bg-black/72 py-2 pl-5 pr-2 backdrop-blur-[10px]">
          <div className="min-w-0">
            <p className="truncate font-[family-name:var(--font-display)] text-menor leading-tight text-marfil">
              {producto.nombre}
            </p>
            <p className="troquel truncate text-nota leading-tight text-humo">
              {precio} · {codigo}
            </p>
          </div>

          <button
            type="button"
            onClick={alAnadir}
            className="versalita shrink-0 rounded-ficha border border-oro/70 px-4 py-2 text-nota text-marfil transition-colors duration-500 hover:bg-vino"
          >
            Añadir
          </button>
        </div>
      </div>
    </>
  )
}
