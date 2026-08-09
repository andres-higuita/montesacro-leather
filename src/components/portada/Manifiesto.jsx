import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* La frase se parte en palabras y cada una entra por su cuenta. Se guarda como
   array y no como string partido en el render para que el reparto sea estable
   entre renders y GSAP no pierda los nodos que está animando. */
const FRASE =
  'Una casa de marroquinería no se mide por lo que muestra, sino por lo que sostiene treinta años después.'.split(
    ' ',
  )

/**
 * El manifiesto: la única banda vinotinto del recorrido.
 *
 * Es el respiro entre la portada y el producto, y el único texto del sitio que
 * se enciende palabra por palabra. Si lo hicieran todos, dejaría de significar
 * algo: aquí funciona porque el ritmo de lectura lo pone el visitante con el
 * scroll, no un temporizador.
 *
 * El disparo es por palabra y con `stagger`, no un scrub por letra: a scrub, al
 * arrastrar rápido la frase parpadea entera y se lee como un fallo de pintado.
 */
export default function Manifiesto() {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top 72%',
            end: 'bottom 62%',
            scrub: 0.6,
          },
        })

        tl.fromTo(
          raiz.current.querySelectorAll('[data-palabra]'),
          { opacity: 0.16 },
          { opacity: 1, duration: 0.5, ease: 'none', stagger: 0.06 },
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
      aria-label="El argumento"
      className="mundo-vino relative py-[clamp(5rem,11vw,9rem)]"
    >
      <div className="canal">
        <p className="versalita text-nota text-acento">02 / El argumento</p>

        <p className="mt-[clamp(2rem,4vw,3.5rem)] max-w-[24ch] font-[family-name:var(--font-display)] text-portada leading-[1.12] text-marfil">
          {FRASE.map((palabra, i) => (
            /* `inline-block` para que la opacidad no arrastre el interletraje,
               y el espacio va DENTRO del span: entre `inline-block` contiguos
               el navegador colapsa el espacio del marcado. */
            <span key={`${palabra}-${i}`} data-palabra className="inline-block">
              {palabra}&nbsp;
            </span>
          ))}
        </p>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-16 gap-y-10 sm:grid-cols-2">
          <p className="max-w-[46ch] text-menor leading-relaxed text-marfil/70">
            MONTESACRO nace de una convicción incómoda: casi todo lo que hoy se vende
            como lujo está hecho para durar una temporada. Nosotros trabajamos al
            revés. Elegimos pieles que envejecen bien, herrajes que se pueden
            reemplazar y costuras que se pueden reparar.
          </p>

          <p className="max-w-[46ch] text-menor leading-relaxed text-marfil/70">
            Cada pieza sale con un número de serie, porque algún día alguien va a
            querer saber cuándo se hizo y quién la hizo. No hay colecciones de
            temporada: si una pieza entra al catálogo, se queda.
          </p>
        </div>
      </div>
    </section>
  )
}
