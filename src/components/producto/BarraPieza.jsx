import { useEffect, useRef, useState } from 'react'

/**
 * Barra de la pieza: nombre, precio, índice del recorrido y compra.
 *
 * Se pega justo DEBAJO de la cápsula del encabezado —no en el borde— porque el
 * encabezado del sitio es flotante y ya ocupa esa franja. Los dos offsets del
 * `top` son la altura real de esa cápsula con su respiro: 4.25rem en móvil,
 * 5.25rem de md en adelante.
 *
 * Aparece al terminar la portada y no antes: sobre el hero competiría con el
 * nombre a tamaño de portada, que es justo lo que la barra viene a sustituir
 * cuando ese nombre ya salió de pantalla.
 *
 * El índice de capítulos son anclas de verdad (`#recorrido`, `#pieles`…), así
 * que funcionan sin JavaScript y se pueden compartir por URL.
 */

const ANCLAS = [
  { a: '#recorrido', texto: 'El recorrido' },
  { a: '#pieles', texto: 'Las pieles' },
  { a: '#ficha', texto: 'Ficha técnica' },
]

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
      setVisible(nodo.getBoundingClientRect().top <= 96)
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

      <div
        className={`sticky top-[4.25rem] z-[var(--z-pegajoso)] transition-opacity duration-500 md:top-[5.25rem] ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="canal">
          <div className="flex items-center justify-between gap-6 rounded-panel border border-marfil/12 bg-black/72 px-5 py-3 backdrop-blur-[10px] md:px-7">
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-display)] text-medio text-marfil">
                {producto.nombre}
              </p>
              <p className="troquel mt-0.5 truncate text-nota text-humo">
                {precio} · Ref. {codigo}
              </p>
            </div>

            <nav aria-label="Secciones de la pieza" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {ANCLAS.map((ancla) => (
                  <li key={ancla.a}>
                    <a
                      href={ancla.a}
                      className="versalita text-nota text-humo transition-colors duration-300 hover:text-marfil"
                    >
                      {ancla.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={alAnadir}
              className="versalita shrink-0 border border-oro px-5 py-2.5 text-nota text-marfil transition-colors duration-500 hover:bg-vino md:px-7"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
