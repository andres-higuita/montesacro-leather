import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { RESPALDO_VERTICAL } from '../../data/imagenes'
import Monograma from '../Monograma'

/**
 * Portada: el metraje de las piezas, reproducido en bucle.
 *
 * Antes esto era una secuencia de fotogramas atada al scroll (ver
 * AperturaScroll, que sigue en el repo). Se cambió a vídeo porque el metraje
 * nuevo no es una toma continua: tiene cortes de plano —los tres colores del
 * clutch, los interiores abiertos— y algunos duran menos de medio segundo. Al
 * arrastrarlos con el scroll pasaban de golpe o se quedaban clavados, según la
 * mano del visitante. Reproducido a su ritmo, cada plano dura lo que dura.
 *
 * Ocupa UNA pantalla y se va con el scroll, como cualquier portada. La versión
 * de scroll se quedaba fija al fondo de la pila; aquí no hace falta, porque no
 * hay nada que el visitante tenga que recorrer.
 *
 * Es la única pieza con movimiento de esta escala en todo el sitio. Funciona
 * porque el resto está quieto.
 */
export default function PortadaVideo() {
  const video = useRef(null)

  useEffect(() => {
    const v = video.current
    if (!v) return

    /* No se usa el atributo `autoplay`: con movimiento reducido el vídeo no
       debe arrancar nunca, y el atributo lo pone en marcha antes de que este
       efecto pueda pararlo. Arrancando desde aquí, quien pide menos movimiento
       se queda con el póster —el bodegón final, que es el mejor plano— y no ve
       ni un fotograma de más. */
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)')

    const aplicar = () => {
      if (menosMovimiento.matches) v.pause()
      // Safari rechaza la promesa si el usuario aún no ha interactuado; el
      // vídeo va en silencio, así que en la práctica solo pasa con políticas
      // de ahorro de datos. En ese caso se queda el póster, que es correcto.
      else v.play().catch(() => {})
    }

    aplicar()
    menosMovimiento.addEventListener('change', aplicar)
    return () => menosMovimiento.removeEventListener('change', aplicar)
  }, [])

  return (
    <section
      aria-label="Objetos de legado. Hechos para trascender."
      className="relative h-svh overflow-hidden bg-black"
    >
      {/* Encaje, distinto según la forma de la pantalla.

          APAISADO — `cover`. El metraje es 16:9 y casi ningún monitor lo es:
          a `contain` quedaban franjas a los lados y, como el fondo del vídeo
          no es negro puro, se veía el rectángulo del encuadre recortado. La
          portada de fotogramas lo resolvía muestreando el color de la esquina,
          pero con un `<video>` no hay lienzo donde hacerlo. `cover` recorta un
          poco de alto —el bodegón está centrado, no se pierde nada— y va a
          sangre, que es lo que tiene que hacer una portada.

          VERTICAL — no se usa el metraje. `cover` recortaría el 70% del ancho y
          partiría el bodegón, y `contain` dejaba una franja de 16:9 flotando en
          medio de una pantalla negra: dos tercios de la portada eran vacío. En
          teléfono manda la TOMA VERTICAL —la misma pieza fotografiada en 9:16—,
          que llena la pantalla con material real. El umbral es el mismo (4/5)
          con el que el resto del sitio decide qué es «vertical».

          El vídeo no se descarga en móvil: `<source media>` hace que el
          navegador ni lo pida cuando la consulta no case. Son los megas del
          metraje ahorrados justo donde más caros salen. */}
      <img
        src={RESPALDO_VERTICAL.id}
        alt={RESPALDO_VERTICAL.alt}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover [@media(min-aspect-ratio:4/5)]:hidden"
      />
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="auto"
        poster="/portada-poster.jpg"
        aria-label="Recorrido de cámara sobre las piezas en caimán —clutch negro, neceser marfil, tarjetero verde— apoyadas en un pedestal de mármol negro"
        className="absolute inset-0 h-full w-full object-cover [@media(max-aspect-ratio:4/5)]:hidden"
      >
        <source src="/portada.mp4" type="video/mp4" media="(min-aspect-ratio: 4/5)" />
      </video>

      {/* Velo inferior: sostiene el titular sobre la parte baja del encuadre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52svh] bg-gradient-to-t from-black via-black/78 to-transparent"
      />
      {/* Velo superior. Llega al 40% porque bajo él va el encabezado flotante:
          sobre una escama iluminada, un velo corto lo deja ilegible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40svh] bg-gradient-to-b from-black via-black/62 to-transparent"
      />

      {/* Reparto inferior en tres: titular · pista de scroll · lectura.
          La pista va en la columna del medio y no en el centro absoluto: ahí
          pisaba los enlaces. */}
      <div className="canal absolute inset-x-0 bottom-0 pb-[clamp(2.5rem,6vw,4.5rem)]">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto_0.8fr] lg:gap-14">
          <div>
            {/* El titular va solo para lectores de pantalla. La página necesita
                un h1 —es su encabezado de primer nivel— pero en pantalla la
                divisa sobraba encima de la pieza. */}
            <h1 className="sr-only">Objetos de legado. Hechos para trascender.</h1>
            <Monograma size={28} className="text-acento" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none hidden flex-col items-center gap-2.5 pb-3 lg:flex"
          >
            <span className="versalita text-nota text-grafia-suave">Bajar</span>
            <span className="block h-10 w-px bg-gradient-to-b from-transparent to-acento" />
          </div>

          <div className="lg:pb-3">
            <p className="max-w-[42ch] text-menor leading-relaxed text-grafia-suave">
              Piel exótica, cortada de un solo lomo y cosida a mano en
              nuestro taller. Sin logo a la vista: la marca aparece dos veces, en el cierre
              metálico y en la placa interior. Quien la reconozca, ya sabía.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-9 gap-y-4">
              <Link
                to="/catalogo"
                className="versalita border-b border-acento pb-1.5 text-menor text-grafia transition-colors duration-400 hover:text-acento"
              >
                Ver las piezas
              </Link>
              <Link
                to="/experiencia"
                className="versalita text-menor text-grafia-suave transition-colors duration-400 hover:text-grafia"
              >
                La experiencia Montesacro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
