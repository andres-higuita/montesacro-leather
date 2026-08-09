import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { COLORWAYS, PRODUCTOS, codigoDeProducto } from '../../data/productos'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PIEZA = PRODUCTOS[0]

/* Las cuatro pieles recortadas, en PNG con alfa. Aquí NO se usan las tomas de
   plató de `imagenes.js`: sobre campo marfil su ciclorama taupe es más oscuro
   que la página, y contra un fondo claro eso no hay máscara que lo disimule
   —deja un óvalo cálido alrededor de la pieza—. Con alfa el problema desaparece
   y además la sombra sigue la silueta. */
const recorte = (id) => `/fotos/bolso/piel-${id}.png`

/* La pieza se despega del panel con su propia sombra. Sigue la SILUETA porque
   el PNG tiene alfa: con un JPEG rectangular esto dibujaría la caja. */
const SOMBRA_PIEZA = 'drop-shadow(0 26px 30px rgba(48,36,28,0.34))'

/* Las cuatro pieles, en el orden del recorrido. La ficha de cada una sale de
   `productos.js`; aquí vive solo lo que es propio de ESTA sección: el epíteto
   del manual de marca y la línea que la distingue de las otras tres. */
const PIELES = [
  {
    id: 'negro',
    epiteto: 'Obsidiana',
    familia: 'Caimán en relieve',
    rotulo: 'La base',
    texto:
      'La piel que no se discute. El relieve se lee por el brillo, no por el color, y el herraje de níquel es lo único que interrumpe la superficie.',
  },
  {
    id: 'verde-botella',
    epiteto: 'Bosque',
    familia: 'Caimán en relieve',
    rotulo: 'La discreta',
    texto:
      'Verde tan cerrado que de noche pasa por negro. Se descubre a la luz del día, y esa es toda la intención.',
  },
  {
    id: 'marfil',
    epiteto: 'Clásico',
    familia: 'Caimán en relieve',
    rotulo: 'La exigente',
    texto:
      'La única que enseña el relieve entero sin ayuda de la luz. También la que menos perdona: cada canto tiene que estar pulido a mano.',
  },
  {
    id: 'vinotinto',
    epiteto: 'Imperial',
    familia: 'Caimán en relieve',
    rotulo: 'La de la casa',
    texto:
      'El color del manual, el mismo del forro de ante y el de la caja. Es la pieza cuando la casa habla de sí misma.',
  },
]

/* Direcciones de entrada, alternas. Sin alternar, las cuatro pieles cruzan
   siempre hacia el mismo lado y el bloque se lee como un carrusel; alternando,
   cada cambio se lee como una pieza distinta que ocupa el sitio de la anterior. */
const SENTIDO = [1, -1, 1, -1]

/* Cuánto dura el recorrido fijado: una pantalla por transición. */
const PANTALLAS = PIELES.length - 1

/**
 * Las cuatro pieles: un bloque fijado que se recorre con el scroll.
 *
 * Un solo hueco para la pieza y una sola columna de ficha, y las cuatro pieles
 * se relevan ahí. No es una rejilla de cuatro tarjetas, y la diferencia es el
 * argumento: en rejilla el visitante compara CUATRO FOTOGRAFÍAS —cada una con
 * su luz— y termina comparando iluminación. En un solo hueco que cambia de piel
 * compara EL MATERIAL, que es lo único que cambia de verdad.
 *
 * EL SCROLL ENGANCHA. `snap` lleva el recorrido a la piel más cercana en cuanto
 * el visitante suelta: nunca se queda a medio camino entre dos. Sin eso, un
 * bloque fijado de cuatro pantallas se recorre lleno de estados intermedios que
 * no son ninguna de las cuatro piezas.
 *
 * EL ÍNDICE LLEVA HISTÉRESIS. La piel activa no sale de redondear el progreso:
 * sale de umbrales con una zona muerta de 0.06, porque justo en la frontera el
 * temblor del scroll hacía parpadear la ficha entre dos pieles.
 */
export default function Variantes() {
  const raiz = useRef(null)
  const escena = useRef(null)
  const rotulo = useRef(null)
  const contador = useRef(null)
  const tomas = useRef([])
  const fichas = useRef([])
  const pasos = useRef([])
  const blooms = useRef([])

  const [activa, setActiva] = useState(0)
  const previa = useRef(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      /* Entradas de cabecera. Van en las dos ramas: sin recorrido siguen
         teniendo sentido, porque solo son una entrada. */
      gsap.fromTo(
        rotulo.current,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: raiz.current, start: 'top 80%', once: true },
        },
      )

      /* El titular sube por palabras desde una máscara. Cada palabra va envuelta
         en un `overflow-hidden` en el marcado, así que basta con subirlas. */
      gsap.fromTo(
        raiz.current.querySelectorAll('[data-palabra]'),
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: { trigger: raiz.current, start: 'top 80%', once: true },
        },
      )

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const st = ScrollTrigger.create({
          trigger: escena.current,
          start: 'top top',
          end: () => `+=${PANTALLAS * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          /* Enganche a cada piel. `directional: false` para que enganche a la
             más cercana y no a la siguiente en el sentido del gesto: con cuatro
             paradas, lo segundo obliga a recorrer el bloque entero para volver. */
          snap: {
            snapTo: gsap.utils.snap(1 / PANTALLAS),
            duration: { min: 0.25, max: 0.55 },
            ease: 'power2.inOut',
            directional: false,
            delay: 0.1,
          },
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            const p = self.progress * PANTALLAS
            setActiva((actual) => {
              /* Solo se cambia de piel cuando el progreso se aleja de la actual
                 más de la zona muerta. En la frontera exacta, sin esto, el
                 temblor del scroll alternaba dos fichas. */
              const objetivo = Math.round(p)
              return Math.abs(p - actual) > 0.56 ? objetivo : actual
            })
          },
        })

        return () => st.kill()
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  /* El relevo. Va en su propio efecto y no dentro del `onUpdate` porque lo que
     dispara la animación es el CAMBIO de piel, no el scroll: entre dos cambios
     el scroll sigue corriendo y las animaciones tienen que terminar a su ritmo,
     no al del dedo. */
  useGSAP(
    () => {
      const anterior = previa.current
      if (anterior === activa) return
      previa.current = activa

      const avanza = activa > anterior
      const n = SENTIDO[activa]

      tomas.current.forEach((nodo, i) => {
        if (!nodo) return
        if (i === activa) {
          gsap.fromTo(
            nodo,
            { xPercent: 30 * n, yPercent: 4, rotate: -9 * n, scale: 0.94, opacity: 0 },
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.85,
              ease: 'power2.out',
              delay: 0.1,
              overwrite: 'auto',
            },
          )
        } else {
          gsap.to(nodo, {
            xPercent: -22 * n,
            yPercent: -3,
            rotate: 8 * n,
            scale: 0.94,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.in',
            overwrite: 'auto',
          })
        }
      })

      /* La ficha entra por el sentido del scroll: bajando llega desde abajo,
         subiendo desde arriba. Es lo que hace que el bloque se sienta recorrido
         y no conmutado. */
      fichas.current.forEach((nodo, i) => {
        if (!nodo) return
        gsap.to(nodo, {
          opacity: i === activa ? 1 : 0,
          y: i === activa ? 0 : avanza ? -40 : 40,
          duration: 0.8,
          ease: 'power2.inOut',
          overwrite: 'auto',
          force3D: true,
        })
      })

      /* El bloom se cruza más lento que la pieza y sin desplazarse: es luz de
         plató, y la luz no entra por un lado de cuadro. */
      blooms.current.forEach((nodo, i) => {
        if (!nodo) return
        gsap.to(nodo, {
          opacity: i === activa ? 1 : 0,
          duration: 1.1,
          ease: 'power2.inOut',
          overwrite: 'auto',
        })
      })

      pasos.current.forEach((nodo, i) => {
        if (!nodo) return
        gsap.to(nodo, {
          opacity: i === activa ? 1 : 0.3,
          duration: 0.5,
          ease: 'power2.inOut',
          overwrite: 'auto',
        })
      })

      if (contador.current) {
        contador.current.textContent = `${activa + 1} / ${PIELES.length}`
      }
    },
    { dependencies: [activa], scope: raiz },
  )

  const guardar = (lista) => (i) => (nodo) => {
    lista.current[i] = nodo
  }

  return (
    <section
      ref={raiz}
      id="pieles"
      aria-label="Las cuatro pieles"
      className="mundo-contra relative bg-marfil"
    >
      {/* TODO va dentro del bloque fijado, cabecera incluida.
          Estaba fuera, y eso dejaba una pantalla entera de hueco: se veía el
          final de la cabecera y el principio del bloque con nada en medio,
          porque el bloque mide un viewport y centra su contenido. Dentro del
          pin no hay transición que ver —el titular entra una vez y se queda
          arriba durante las cuatro pieles—, que además es como debe ser: es el
          rótulo de lo que se está mirando, no un encabezado que se abandona. */}
      <div ref={escena} className="relative flex h-svh flex-col overflow-hidden">
        <div className="canal pt-[clamp(4.5rem,11vh,7rem)]">
          <div className="flex items-baseline justify-between gap-8">
            <p ref={rotulo} className="versalita text-nota text-oro-hondo">
              02 <span className="mx-2 opacity-50">/</span> Las cuatro pieles
            </p>
            <p ref={contador} className="troquel text-nota text-tinta-suave">
              1 / {PIELES.length}
            </p>
          </div>

          <h2 className="mt-5 font-[family-name:var(--font-display)] text-titulo leading-[1.02] tracking-[-0.02em] text-tinta">
            {'Una horma. Cuatro pieles.'.split(' ').map((palabra, i) => (
              /* Cada palabra en su propia máscara: es lo que permite que suba
                 desde debajo del renglón en vez de aparecer fundiéndose. */
              <span key={`${palabra}-${i}`} className="inline-block overflow-hidden pb-[0.08em]">
                <span data-palabra className="inline-block">
                  {palabra}&nbsp;
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* `flex-1` y `items-center`: el contenido ocupa lo que sobra bajo el
            titular y se centra ahí dentro, en vez de centrarse en la pantalla
            entera ignorando la cabecera. */}
        <div className="canal grid w-full flex-1 items-center gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          {/* ── La ficha, en relevo ────────────────────────────────────
              Las cuatro se apilan en LA MISMA CELDA de una rejilla, y no
              `absolute` sobre un contenedor con alto mínimo. La diferencia es
              la que pedía el encaje: con `absolute` el contenedor no tiene
              alto propio, así que el `items-center` de la rejilla exterior
              centraba una caja más corta que su contenido y la pieza quedaba
              descuadrada respecto al texto. Apiladas en la celda, el
              contenedor mide lo que mide la ficha más larga y las dos columnas
              se centran de verdad. */}
          <div className="order-2 grid lg:order-1">
            {PIELES.map((piel, i) => {
              const ficha = COLORWAYS[piel.id]
              return (
                <div
                  key={piel.id}
                  ref={guardar(fichas)(i)}
                  aria-hidden={i !== activa}
                  className="col-start-1 row-start-1"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <p className="troquel text-nota text-tinta">
                      {codigoDeProducto(PIEZA, piel.id)}
                    </p>
                    <p className="versalita text-nota text-tinta-suave">{piel.rotulo}</p>
                  </div>

                  <h3 className="mt-6 flex items-end gap-2 font-[family-name:var(--font-display)] text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-tinta">
                    {ficha.nombre}
                    {/* El punto toma el color de la piel. Es el único sitio de
                        la sección donde el material se dice con color y no con
                        fotografía. */}
                    <span
                      aria-hidden="true"
                      className="mb-[0.18em] inline-block h-[0.28em] w-[0.28em] rounded-full ring-1 ring-tinta/25"
                      style={{ background: ficha.token }}
                    />
                  </h3>

                  <p className="mt-3 font-[family-name:var(--font-display)] text-medio italic text-tinta-suave">
                    {piel.familia} · {piel.epiteto}
                  </p>

                  <p className="mt-6 max-w-[42ch] text-menor leading-relaxed text-tinta-suave">
                    {piel.texto}
                  </p>

                  <dl className="mt-9 border-t border-oro-hondo/25">
                    {PIEZA.specs.materiales.map(([clave, valor]) => (
                      <div
                        key={clave}
                        className="flex items-baseline justify-between gap-6 border-b border-oro-hondo/25 py-2.5"
                      >
                        <dt className="shrink-0 text-nota text-tinta-suave">{clave}</dt>
                        <dd className="troquel max-w-[24ch] text-right text-nota text-tinta">
                          {valor}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex items-baseline justify-between gap-6">
                    <p className="versalita text-nota text-tinta-suave">Peso</p>
                    <p className="troquel text-mayor text-tinta">{PIEZA.peso}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── La pieza, en relevo ──────────────────────────────────── */}
          {/* `lg:h-full` y no un alto en `svh`: con la cabecera ya dentro del
              pin, un alto medido contra la pantalla se sale por abajo. Aquí el
              hueco es el que sobra, y la pieza se ajusta a él. */}
          <div className="relative order-1 aspect-[4/3] w-full lg:order-2 lg:aspect-auto lg:h-full">
            {/* EL BLOOM. Un degradado radial teñido con el color de la piel que
                se disuelve a transparente antes de llegar a ningún borde. Aquí
                había un panel con canto redondeado y sombra: tenía borde, y un
                borde sobre campo plano se ve siempre, por suave que sea la
                sombra. Un degradado que termina en `transparent` no puede tener
                borde — no es que esté disimulado, es que no existe.

                Va TEÑIDO y no neutro porque es la única pista de color de la
                sección: la ficha de al lado dice «Verde botella» y el bloom lo
                confirma antes de que se lea la palabra.

                Respira en bucle y ajeno al scroll: es lo único que se mueve
                cuando el recorrido está enganchado en una piel y el visitante
                está leyendo. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 animate-[respirar-panel_11s_ease-in-out_infinite]"
            >
              {PIELES.map((piel, i) => (
                <div
                  key={piel.id}
                  ref={guardar(blooms)(i)}
                  className="absolute inset-0"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    /* Dos capas en un solo degradado: el tinte de la piel y,
                       debajo, una sombra cálida neutra que le da peso a la
                       marfil —que sobre campo marfil no tiñe nada—. */
                    background: `radial-gradient(closest-side at 50% 52%, color-mix(in oklab, ${COLORWAYS[piel.id].token} 26%, transparent) 0%, color-mix(in oklab, ${COLORWAYS[piel.id].token} 10%, transparent) 42%, color-mix(in oklab, var(--color-tinta) 5%, transparent) 62%, transparent 78%)`,
                  }}
                />
              ))}
            </div>

            {/* El número de la piel, gigante y en filete, sobre el panel. Da
                escala al hueco sin meter otra fotografía. */}
            <p
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] text-[34vh] leading-none text-tinta/[0.055]"
            >
              0{activa + 1}
            </p>

            {PIELES.map((piel, i) => (
              <img
                key={piel.id}
                ref={guardar(tomas)(i)}
                src={recorte(piel.id)}
                alt={`Bolso de mano en piel ${COLORWAYS[piel.id].nombre.toLowerCase()}, con relieve de caimán, solapa cerrada y correa de muñeca con la placa de iniciales`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                aria-hidden={i !== activa}
                className="absolute inset-0 h-full w-full object-contain will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0, filter: SOMBRA_PIEZA }}
              />
            ))}
          </div>
        </div>

        {/* El paginador. Botones y no rótulos: con el bloque fijado, saltar a
            una piel concreta es la única forma de llegar sin recorrer. */}
        <div className="canal absolute inset-x-0 bottom-[clamp(1.5rem,4vw,2.5rem)] flex justify-end gap-6">
          {PIELES.map((piel, i) => (
            <button
              key={piel.id}
              ref={guardar(pasos)(i)}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver ${COLORWAYS[piel.id].nombre}`}
              aria-current={i === activa}
              className="troquel text-nota text-tinta transition-opacity duration-300"
              style={{ opacity: i === 0 ? 1 : 0.3 }}
            >
              0{i + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
