import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SECUENCIA_APERTURA } from '../../data/imagenes'
import dibujarTarjetero from './dibujarTarjetero'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Apertura ligada al scroll.
 *
 * No es un video: es un índice de fotograma atado a la posición de scroll. Por
 * eso al subir se cierra — el visitante controla la apertura en los dos
 * sentidos, que es lo que hace que el gesto se sienta suyo.
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
  const copyInicio = useRef(null)
  const copyFinal = useRef(null)
  const fotogramas = useRef([])
  const [cargando, setCargando] = useState(SECUENCIA_APERTURA.total > 0)

  useGSAP(
    () => {
      const canvas = lienzo.current
      const ctx = canvas.getContext('2d')
      const estado = { p: 0 }

      /* ── Tamaño del lienzo, con densidad de pantalla ─────────────── */
      let ancho = 0
      let alto = 0

      const medir = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const caja = canvas.getBoundingClientRect()
        ancho = caja.width
        alto = caja.height
        canvas.width = Math.round(ancho * dpr)
        canvas.height = Math.round(alto * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      const pintar = () => {
        const p = gsap.utils.clamp(0, 1, estado.p)

        if (SECUENCIA_APERTURA.total > 0) {
          const i = Math.round(p * (SECUENCIA_APERTURA.total - 1))
          const img = fotogramas.current[i]
          if (!img?.complete) return
          ctx.clearRect(0, 0, ancho, alto)
          // `contain`: el encuadre del metraje manda, no se recorta nada
          const escala = Math.min(ancho / img.width, alto / img.height)
          const w = img.width * escala
          const h = img.height * escala
          ctx.drawImage(img, (ancho - w) / 2, (alto - h) / 2, w, h)
          return
        }

        dibujarTarjetero(ctx, ancho, alto, p)
      }

      medir()
      pintar()

      /* ── Precarga de la secuencia real ───────────────────────────── */
      if (SECUENCIA_APERTURA.total > 0) {
        let listos = 0
        fotogramas.current = Array.from({ length: SECUENCIA_APERTURA.total }, (_, i) => {
          const img = new Image()
          img.src = SECUENCIA_APERTURA.ruta(i)
          img.onload = () => {
            listos += 1
            if (listos === 1) pintar()
            if (listos === SECUENCIA_APERTURA.total) {
              setCargando(false)
              ScrollTrigger.refresh()
            }
          }
          img.onerror = () => {
            listos += 1
            if (listos === SECUENCIA_APERTURA.total) setCargando(false)
          }
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
        gsap.set(copyInicio.current, { opacity: 0 })
        gsap.set(copyFinal.current, { opacity: 1, y: 0 })
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
          .to(copyInicio.current, { opacity: 0, y: -24, duration: 0.2, ease: 'none' }, 0)
          .fromTo(
            copyFinal.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.25, ease: 'none' },
            0.62,
          )

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
      aria-label="La apertura de un tarjetero Montesacro"
      style={{ height: `${recorrido * 100}svh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <canvas
          ref={lienzo}
          className="h-full w-full"
          role="img"
          aria-label={SECUENCIA_APERTURA.alt}
        />

        {cargando && (
          <p className="versalita absolute text-nota text-grafia-suave" role="status">
            Cargando la secuencia
          </p>
        )}

        {/* Copy de entrada */}
        <div
          ref={copyInicio}
          className="pointer-events-none absolute inset-x-0 top-[18%] px-[var(--medida-canal)] text-center"
        >
          <h2 className="text-titulo text-grafia">Ábralo despacio</h2>
          <p className="mx-auto mt-4 max-w-[34ch] text-menor text-grafia-suave">
            Baje para abrir el tarjetero. Suba para cerrarlo.
          </p>
        </div>

        {/* Copy de salida, cuando ya está abierto */}
        <div
          ref={copyFinal}
          className="pointer-events-none absolute inset-x-0 bottom-[12%] px-[var(--medida-canal)] text-center opacity-0"
        >
          <p className="versalita text-nota text-acento">La segunda aparición</p>
          <h3 className="mx-auto mt-4 max-w-[22ch] text-titulo text-grafia">
            La marca solo la ve quien la usa
          </h3>
          <p className="mx-auto mt-4 max-w-[42ch] text-menor text-grafia-suave">
            Placa de cuero grabada en dorado, cosida al forro. Es el único lugar del
            tarjetero donde el nombre de la casa queda escrito.
          </p>
        </div>
      </div>
    </section>
  )
}
