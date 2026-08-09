import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { IMG_PRODUCTO } from '../../data/imagenes'
import { CIERRE } from '../../data/productos'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* La toma abierta en negro: es la única donde se ven a la vez el forro de ante
   vinotinto, la placa MONTESACRO cosida a la solapa, el tirador con el
   monograma MS y el broche imantado del cuerpo. */
const ABIERTO = IMG_PRODUCTO['bolso-de-mano'].galeria[0]

/**
 * El interior: donde la marca aparece por dentro.
 *
 * Un empuje de cámara ligado al scroll sobre la fotografía real. La toma entra
 * completa y termina cerrada sobre el tirador del monograma, que es el punto
 * donde la pieza firma.
 *
 * ES FOTOGRAFÍA, NO METRAJE GENERADO, y a propósito. Este es el plano donde se
 * cuentan las puntadas y se lee la placa: cualquier modelo generativo reescribe
 * las letras y cambia el número de costuras entre fotogramas, y aquí eso se ve.
 * El movimiento lo pone el encuadre, no el objeto.
 *
 * `transform-origin` desplazado y no centrado: el tirador está arriba a la
 * izquierda del encuadre, así que un empuje centrado lo sacaría de cuadro justo
 * cuando tiene que mandar.
 */
export default function ElInterior() {
  const raiz = useRef(null)
  const toma = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        })

        tl.fromTo(
          toma.current,
          { scale: 1 },
          { scale: 1.85, duration: 1, ease: 'none' },
        )

        return () => tl.scrollTrigger?.kill()
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section
      ref={raiz}
      id="interior"
      aria-label="El interior"
      style={{ height: '240svh' }}
      className="relative bg-obsidiana"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="relative h-[62svh] w-full overflow-hidden">
          <img
            ref={toma}
            src={ABIERTO.id}
            alt={ABIERTO.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover will-change-transform"
            style={{ transformOrigin: '32% 46%' }}
          />

          {/* Velo inferior: el texto cae sobre la parte baja de la toma, que es
              piel negra iluminada, y sin velo las versalitas se pierden. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidiana to-transparent"
          />
        </div>

        <div className="canal mt-[clamp(1.5rem,4vw,2.5rem)] w-full">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <div>
              <p className="versalita text-nota text-acento">05 / El interior</p>
              <h2 className="mt-4 max-w-[20ch] font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
                La marca aparece dos veces, y las dos por dentro
              </h2>
              <p className="mt-5 max-w-[48ch] text-menor leading-relaxed text-humo">
                Una en la placa cosida al forro de ante. La otra en el tirador del
                bolsillo, fundido con el monograma MS integrado. Por fuera, la
                pieza no lleva nombre.
              </p>
            </div>

            <dl className="self-end border-t border-acento/30">
              {[
                ['Sistema', CIERRE.sistema],
                ['Material', CIERRE.material],
                ['Tirador', CIERRE.medidas],
              ].map(([clave, valor]) => (
                <div
                  key={clave}
                  className="flex items-baseline justify-between gap-6 border-b border-acento/30 py-3"
                >
                  <dt className="shrink-0 text-nota text-humo">{clave}</dt>
                  <dd className="troquel text-right text-nota text-marfil">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
