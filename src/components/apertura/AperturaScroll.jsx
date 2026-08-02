import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  foto,
  RESPALDO_APERTURA,
  RESPALDO_VERTICAL,
  SECUENCIA_APERTURA,
  SECUENCIA_VERTICAL,
} from '../../data/imagenes'
import Monograma from '../Monograma'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Portada: la apertura de la pieza, ligada al scroll.
 *
 * No es un video: es un índice de fotograma atado a la posición de scroll. Por
 * eso al subir se cierra — el visitante controla la apertura en los dos
 * sentidos, que es lo que hace que el gesto se sienta suyo.
 *
 * El encuadre se queda fijo mientras dura el recorrido y el texto se reparte
 * por las esquinas, dejando el centro entero para la pieza: titular abajo a la
 * izquierda, lectura abajo a la derecha, apuntes arriba. No hay foto de portada
 * estática — la primera pantalla del sitio ya es la pieza abriéndose.
 *
 * Dos fuentes posibles, decididas en `src/data/imagenes.js`:
 * - `SECUENCIA_APERTURA.total > 0` → dibuja el fotograma correspondiente.
 * - `total === 0` → dibuja el tarjetero por código (marcador de posición).
 *
 * Es la ÚNICA sección del sitio con movimiento de esta escala. El efecto
 * funciona porque el resto está quieto; repetirlo lo anularía.
 */
export default function AperturaScroll({ recorrido = 3 }) {
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const apunte = useRef(null)
  const bajar = useRef(null)
  const sello = useRef(null)
  const lectura = useRef(null)
  const fotogramas = useRef([])
  const respaldo = useRef(null)
  const fondo = useRef('#000000')
  const retrato = useRef(null)
  const [cargando, setCargando] = useState(SECUENCIA_APERTURA.total > 0)

  useGSAP(
    () => {
      const canvas = lienzo.current
      const ctx = canvas.getContext('2d')
      const estado = { p: 0 }

      /* Qué secuencia se descarga. Se decide UNA vez, al montar: bajar las dos
         serían 13 MB tirados. Si el móvil aún no tiene secuencia vertical, cae
         en la horizontal y el dibujado usa la toma en 9:16 como respaldo. */
      const pantallaVertical = window.matchMedia('(max-aspect-ratio: 4/5)').matches
      const SEC =
        pantallaVertical && SECUENCIA_VERTICAL.total > 0
          ? SECUENCIA_VERTICAL
          : SECUENCIA_APERTURA

      /* ── Tamaño del lienzo, con densidad de pantalla ─────────────── */
      let ancho = 0
      let alto = 0
      let densidad = 1

      const medir = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        densidad = dpr
        const caja = canvas.getBoundingClientRect()
        ancho = caja.width
        alto = caja.height
        canvas.width = Math.round(ancho * dpr)
        canvas.height = Math.round(alto * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        // El metraje es 720p reescalado: sin esto el canvas remuestrea con el
        // filtro barato y el grano de la piel se convierte en papilla.
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
      }

      const pintar = () => {
        const p = gsap.utils.clamp(0, 1, estado.p)

        if (SEC.total > 0) {
          const i = Math.round(p * (SEC.total - 1))
          const img = fotogramas.current[i]
          if (!img?.complete) return
          // Rellenar con el negro DEL FOTOGRAMA, no con el del tema. El JPEG
          // no comprime a #000 exacto, así que sobre un fondo distinto se veía
          // el rectángulo del encuadre recortado. Tomando el color de su
          // propia esquina, el corte deja de existir a cualquier tamaño.
          ctx.fillStyle = fondo.current
          ctx.fillRect(0, 0, ancho, alto)

          /* Encaje, distinto según la forma de la pantalla.

             APAISADO — `contain` con techo de ampliación. Sin el techo, en un
             monitor grande o de alta densidad el fotograma se estira muy por
             encima de su resolución real y la piel se deshace. La cuenta va en
             píxeles de dispositivo, no CSS: dibujar a `w` de ancho ocupa
             `w × densidad` píxeles reales.

             VERTICAL — el metraje es 16:9 y la pantalla de un móvil es lo
             contrario. Centrarlo dejaba la pieza diminuta en mitad del hueco;
             llenar a `cover` recortaba el asa y partía la composición. Se
             ajusta al ANCHO y se coloca arriba, dejando la mitad baja para el
             titular y la lectura. Es la misma solución que MORAE en móvil:
             pieza arriba, texto debajo, sin superponer. */
          const NITIDEZ = 1.3
          const relacionPantalla = ancho / alto
          const vertical = relacionPantalla < (img.width / img.height) * 0.8

          /* En vertical manda la toma en 9:16, que es la misma pieza pero
             encuadrada para móvil. Llena la pantalla sin recortar el asa, y el
             scroll mueve un acercamiento lento en vez de la apertura: una sola
             imagen no puede abrirse. */
          const retratoImg = retrato.current
          const sinSecuenciaVertical = SEC !== SECUENCIA_VERTICAL
          if (
            vertical &&
            sinSecuenciaVertical &&
            retratoImg?.complete &&
            retratoImg.naturalWidth
          ) {
            const acerca = 1.14 - 0.14 * p
            const e = Math.max(ancho / retratoImg.width, alto / retratoImg.height) * acerca
            const rw = retratoImg.width * e
            const rh = retratoImg.height * e
            ctx.drawImage(retratoImg, (ancho - rw) / 2, (alto - rh) / 2, rw, rh)
            return
          }

          const escala = vertical
            ? ancho / img.width
            : Math.min(ancho / img.width, alto / img.height, NITIDEZ / densidad)

          const w = img.width * escala
          const h = img.height * escala
          // Sin toma vertical, el fotograma 16:9 se ajusta al ancho y sube al
          // 34% del alto para dejar sitio al texto.
          const y = vertical ? alto * 0.34 - h / 2 : (alto - h) / 2
          ctx.drawImage(img, (ancho - w) / 2, y, w, h)
          return
        }

        /* Sin secuencia: una sola fotografía real con empuje de cámara lento.
           `cover` y no `contain` — aquí la foto es el fondo del hero, no una
           pieza recortada, así que tiene que llenar el encuadre. */
        const img = respaldo.current
        if (!img?.complete || !img.naturalWidth) return

        ctx.clearRect(0, 0, ancho, alto)
        const acercamiento = 1.22 - 0.22 * p
        const escala = Math.max(ancho / img.width, alto / img.height) * acercamiento
        const w = img.width * escala
        const h = img.height * escala
        // Deriva vertical mínima: da sensación de cámara sin marear
        const desvio = (p - 0.5) * alto * 0.05
        ctx.drawImage(img, (ancho - w) / 2, (alto - h) / 2 + desvio, w, h)
      }

      medir()
      pintar()

      /* ── Toma vertical para móvil ─────────────────────────────────── */
      {
        const img = new Image()
        img.decoding = 'async'
        img.src = RESPALDO_VERTICAL.id
        img.onload = () => {
          pintar()
          ScrollTrigger.refresh()
        }
        retrato.current = img
      }

      /* ── Respaldo: la fotografía única mientras no haya secuencia ── */
      if (SEC.total === 0) {
        const img = new Image()
        img.decoding = 'async'
        img.src = foto(RESPALDO_APERTURA.id, 2000)
        img.onload = () => {
          pintar()
          ScrollTrigger.refresh()
        }
        respaldo.current = img
      }

      /* ── Precarga de la secuencia real ───────────────────────────── */
      if (SEC.total > 0) {
        // La secuencia pesa unos 10 MB. Esperar a los 123 fotogramas dejaría el
        // hero en blanco demasiado tiempo, así que se descubre en cuanto hay
        // margen para empezar a bajar y el resto sigue llegando por detrás.
        const SUFICIENTE = Math.min(24, SEC.total)
        let listos = 0

        /** Toma el color de una esquina del fotograma: ahí solo hay fondo. */
        const muestrearFondo = (img) => {
          try {
            const lienzoAux = document.createElement('canvas')
            lienzoAux.width = 1
            lienzoAux.height = 1
            const auxCtx = lienzoAux.getContext('2d', { willReadFrequently: true })
            auxCtx.drawImage(img, 2, 2, 1, 1, 0, 0, 1, 1)
            const [r, g, b] = auxCtx.getImageData(0, 0, 1, 1).data
            fondo.current = `rgb(${r}, ${g}, ${b})`
          } catch {
            /* lienzo contaminado: se queda el negro por defecto */
          }
        }

        const contar = function () {
          listos += 1
          if (listos === 1) {
            muestrearFondo(this)
            pintar()
          }
          if (listos === SUFICIENTE) setCargando(false)
          if (listos === SEC.total) ScrollTrigger.refresh()
        }

        fotogramas.current = Array.from({ length: SEC.total }, (_, i) => {
          const img = new Image()
          // Los primeros mandan: son los que se ven antes de tocar el scroll.
          img.fetchPriority = i < SUFICIENTE ? 'high' : 'low'
          img.decoding = 'async'
          img.src = SEC.ruta(i)
          img.onload = contar
          img.onerror = contar
          return img
        })
      }

      const alRedimensionar = () => {
        medir()
        pintar()
      }
      window.addEventListener('resize', alRedimensionar)

      /* ── Movimiento ──────────────────────────────────────────────── */
      const mm = gsap.matchMedia()

      // Con movimiento reducido no hay recorrido: se muestra la pieza abierta
      mm.add('(prefers-reduced-motion: reduce)', () => {
        estado.p = 0.8
        pintar()
        gsap.set([apunte.current, bajar.current], { opacity: 0 })
        gsap.set(sello.current, { opacity: 1, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })

        tl.to(estado, { p: 1, duration: 1, ease: 'none', onUpdate: pintar }, 0)
          // Los apuntes de arriba y la pista de scroll sobran en cuanto la
          // pieza empieza a abrirse: ya cumplieron su función.
          .to([apunte.current, bajar.current], { opacity: 0, duration: 0.14, ease: 'none' }, 0)
          // El sello entra cuando la placa interior ya se ve.
          .fromTo(
            sello.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.2, ease: 'none' },
            0.6,
          )
          // La lectura se retira al final para no pelearse con el manifiesto.
          .to(lectura.current, { opacity: 0, duration: 0.12, ease: 'none' }, 0.86)

        return () => tl.scrollTrigger?.kill()
      })

      return () => {
        window.removeEventListener('resize', alRedimensionar)
        mm.revert()
      }
    },
    { scope: raiz },
  )

  return (
    <section
      ref={raiz}
      aria-label="Objetos de legado. Hechos para trascender."
      style={{ height: `${recorrido * 100}svh` }}
      className="relative"
    >
      {/* Capa FIJA, no pegajosa.
          La pieza se queda clavada al viewport en el fondo de la pila y las
          secciones siguientes le pasan por encima: el hero no se va hacia
          arriba, se queda detrás. Por eso todo lo que viene después lleva
          fondo opaco y un z mayor — si alguna sección fuera transparente, se
          vería la pieza a través de ella.

          Fondo negro puro y no obsidiana: el metraje viene con fondo #000 y se
          dibuja `contain`, así que sobre obsidiana se recortaba el rectángulo
          del encuadre. */}
      <div className="fixed inset-0 z-0 h-svh overflow-hidden bg-black">
        {/* A sangre. Con secuencia el dibujo va `contain` y la pieza queda
            centrada con aire; con la fotografía de respaldo va `cover` y llena
            el encuadre. En los dos casos los velos sostienen el texto. */}
        <canvas
          ref={lienzo}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={
            SECUENCIA_APERTURA.total > 0 ? SECUENCIA_APERTURA.alt : RESPALDO_APERTURA.alt
          }
        />

        {cargando && (
          <p
            className="versalita absolute inset-0 flex items-center justify-center text-nota text-grafia-suave"
            role="status"
          >
            Cargando la secuencia
          </p>
        )}

        {/* Velo inferior: sostiene el titular sobre la parte baja de la pieza. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[52svh] bg-gradient-to-t from-black via-black/78 to-transparent"
        />
        {/* Velo superior. Llega hasta el 40% porque bajo él van el encabezado
            flotante Y el apunte de material: sobre una escama iluminada, un
            velo corto deja los dos ilegibles. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[40svh] bg-gradient-to-b from-black via-black/62 to-transparent"
        />

        {/* Apunte de manejo, arriba a la izquierda */}
        <div
          ref={apunte}
          className="canal pointer-events-none absolute inset-x-0 top-[20%]"
        >
          <p className="max-w-[24ch] text-menor leading-relaxed text-grafia-suave">
            Baje para abrir la pieza. Suba para cerrarla.
          </p>
        </div>

        {/* Sello, arriba a la derecha: entra cuando la placa ya se ve */}
        <p
          ref={sello}
          className="versalita pointer-events-none absolute top-[30%] right-[var(--medida-canal)] max-w-[22ch] text-right text-nota text-acento opacity-0"
        >
          La segunda aparición · la marca solo la ve quien la usa
        </p>

        {/* Reparto inferior en tres: titular · pista de scroll · lectura.
            La pista va en la columna del medio, bajo la pieza, y no en el
            centro absoluto: ahí pisaba los enlaces. */}
        <div className="canal absolute inset-x-0 bottom-0 pb-[clamp(2.5rem,6vw,4.5rem)]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto_0.8fr] lg:gap-14">
            <div>
              {/* El titular va solo para lectores de pantalla. La página
                  necesita un h1 —es su encabezado de primer nivel— pero en
                  pantalla la divisa sobraba encima de la pieza. */}
              <h1 className="sr-only">Objetos de legado. Hechos para trascender.</h1>
              <Monograma size={28} className="text-acento" />
            </div>

            {/* Pista de scroll: se apaga en cuanto la pieza empieza a abrirse */}
            <div
              ref={bajar}
              aria-hidden="true"
              className="pointer-events-none hidden flex-col items-center gap-2.5 pb-3 lg:flex"
            >
              <span className="versalita text-nota text-grafia-suave">Bajar</span>
              <span className="block h-10 w-px bg-gradient-to-b from-transparent to-acento" />
            </div>

            <div ref={lectura} className="lg:pb-3">
              <p className="max-w-[42ch] text-menor leading-relaxed text-grafia-suave">
                Tres piezas en piel exótica, cortadas de un solo lomo y cosidas a mano en
                nuestro taller. Sin logo a la vista: la marca aparece dos veces, en el
                cierre metálico y en la placa interior. Quien la reconozca, ya sabía.
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
      </div>
    </section>
  )
}
