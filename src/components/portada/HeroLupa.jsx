import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* La toma que vive dentro de la lente y del iris.
   Es un PNG con alfa —solo la pieza, sin plató—, y de ahí salen dos cosas que
   con un JPEG rectangular no se pueden hacer: la pieza flota de verdad sobre el
   obsidiana, y la sombra de `drop-shadow` sigue su SILUETA en vez del borde de
   la caja. */
const PIEZA = {
  id: '/fotos/bolso/hero-recorte.png',
  alt: 'Bolso de mano en piel negra con relieve de caimán, solapa cerrada y correa de muñeca con la placa de iniciales',
}

/* Toda la separación de la pieza vive aquí, y son dos `drop-shadow` apilados.
   `drop-shadow` sobre un PNG con alfa sigue la SILUETA del objeto, no el borde
   de su caja: por eso resuelve lo que un fondo no puede. Un fondo solo sabe
   dibujar formas propias, y cualquier forma propia se lee como una mancha.

   1. El resplandor, ceñido al contorno. Impide que una pieza NEGRA se funda con
      el campo obsidiana sin inventar ningún óvalo.
   2. La sombra proyectada hacia abajo, que la despega y la hace flotar. */
const SOMBRA = [
  'drop-shadow(0 0 46px rgba(214,224,232,0.20))',
  'drop-shadow(0 38px 46px rgba(0,0,0,0.7))',
].join(' ')

/* ════════════════════════════════════════════════════════════════════════
   EL MOTOR DE LA LENTE

   Portado del hero de referencia leyendo su código, no aproximado a ojo. Las
   constantes son suyas; solo están reescaladas al tamaño de nuestra pieza —ver
   `RADIO_BASE`—, porque su producto es una lata estrecha y el nuestro un bolso
   apaisado.

   La parte que importa, y la que yo tenía mal, es CÓMO SE MUEVE EL RADIO:

     radio = BASE·entrada + hinchazón + respiro·entrada + empujeScroll

   `hinchazón` NO sigue la velocidad del puntero fotograma a fotograma. Funciona
   como un trinquete:

     · en cada `pointermove` se mide la velocidad en píxeles por SEGUNDO;
     · si el objetivo supera a la hinchazón actual, se sube con un tween de
       0.3 s. Si no lo supera, NO PASA NADA: nunca baja mientras haya
       movimiento;
     · cada evento reinicia un temporizador de 0.3 s. Cuando por fin pasan
       0.3 s sin un solo evento, la hinchazón cae a cero en 1.1 s.

   Ligarlo a la velocidad instantánea —que es lo que yo hacía— produce un
   parpadeo inevitable: `pointermove` no dispara en todos los fotogramas, así
   que los fotogramas sin evento miden velocidad cero y desploman el radio, y el
   siguiente evento lo devuelve arriba. El trinquete + el temporizador es lo que
   convierte una señal ruidosa en un gesto.
   ════════════════════════════════════════════════════════════════════════ */

/* LA ÚNICA PERILLA DEL TAMAÑO. Todo lo demás se deriva de aquí conservando las
   proporciones del original —130/170 de hinchazón y 9/170 de respiro—, que son
   las que se sienten. Cambiar solo este número mueve la lente entera sin tocar
   el gesto.

   180 px de radio deja 360 de diámetro en reposo y 654 en el pico. Es
   prácticamente la medida del original (170 / 340 / 618); antes estaba en 240 y
   se leía como un agujero, no como una lente. */
const RADIO_BASE = 180

/* Cuánto crece como máximo con el gesto. Es una perilla APARTE de `RADIO_BASE`
   a propósito: gobierna el recorrido del gesto, no el tamaño de reposo.

   El original usa 130 sobre una base de 170 —casi duplica el diámetro—, pero
   ahí el producto es una lata estrecha que cabe entera. Con un bolso apaisado
   ese recorrido abría un boquete. En 70 la lente pasa de 360 a 520 px de
   diámetro: el crecimiento se siente igual de claro y la pieza nunca llega a
   verse completa, que es justo lo que mantiene la lente como lente. */
const HINCHAZON_MAX = 70

const RESPIRO_MAX = RADIO_BASE * (9 / 170)

/* Velocidad de puntero, en px/s, a la que la hinchazón llega al tope. */
const VELOCIDAD_TOPE = 2200

/* Tiempos, todos del original. */
const SUBIDA = 0.3 // lo que tarda en hincharse
const ESPERA_QUIETO = 0.3 // quietud necesaria antes de empezar a bajar
const CAIDA = 1.1 // lo que tarda en desinflarse
const PERSECUCION = 0.62 // lo que tarda el centro en alcanzar al puntero
const RESPIRO_CICLO = 2.2 // medio ciclo de la respiración
const ENTRADA = 1.2 // apertura inicial de la lente

/* Giro de la pieza con el puntero. El original hace girar un modelo 3D 2.2π
   radianes de borde a borde —casi vuelta y media—. Una fotografía no puede
   girar, así que aquí el equivalente es una inclinación en perspectiva. Es la
   única desviación deliberada respecto al original, y es porque la nuestra es
   una imagen y la suya una malla. */
const GIRO_Y = 13
const GIRO_X = 5.5
const PERSPECTIVA = 1400

/* Desplazamiento de la pieza al terminar el iris, en fracción del ancho. En el
   acto 1 está SIEMPRE centrada; solo se corre según avanza el scroll, para
   dejarle la mitad izquierda a la ficha. */
const CORRIMIENTO_FINAL = 0.15
const ANCHO_DOS_COLUMNAS = 1024

/* Longitud del recorrido fijado, en viewports. El original usa `end: '+=120%'`. */
const RECORRIDO = 1.2

/* Reparto del recorrido, también del original. */
const TRAMO_IRIS = 0.55 // el iris termina de abrirse aquí
const APAGA_VELO = 0.48 // el campo marfil se funde a partir de aquí
const ENTRA_FICHA = 0.58 // umbral que dispara el bloque de ficha
const SALE_FICHA = 0.35 // umbral que lo rearma al subir

/** Atenuación de todo lo que depende del puntero según avanza el iris. */
const atenuar = (p) => (1 - Math.min(p / 0.6, 1)) ** 3

/**
 * La portada: un viewport fijado con tres actos.
 *
 * ACTO 1 · reposo. Campo marfil, el nombre de la casa a sangre. Una LENTE
 * circular sigue al cursor y dentro se ve el mundo obsidiana con la pieza. La
 * lente se hincha con el gesto y se desinfla al soltar.
 *
 * ACTO 2 · el iris. Al bajar, esa misma lente crece hasta tragarse la pantalla.
 *
 * ACTO 3 · la ficha. Con el iris lleno entra por la izquierda el bloque
 * numerado, y la pieza se corre a la derecha para dejarle sitio.
 *
 * LA LENTE Y EL IRIS SON EL MISMO ELEMENTO: un solo `clip-path: circle()` sobre
 * la capa oscura. En el acto 1 el radio lo manda el puntero; en el acto 2 se le
 * suma `empujeScroll` y lo manda el scroll. Por eso el paso no tiene costura.
 */
export default function HeroLupa() {
  const raiz = useRef(null)
  const iris = useRef(null)
  const anillo = useRef(null)
  const conjunto = useRef(null)
  const velo = useRef(null)
  const ficha = useRef(null)
  const capaPieza = useRef(null)
  const giroPieza = useRef(null)

  /* Se deciden al montar: de esto depende el ARMADO del bloque, no solo si hay
     animación. */
  const [quieto] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [hayCursor] = useState(() => window.matchMedia('(hover: hover)').matches)

  useGSAP(
    () => {
      if (quieto) return

      /* Un único objeto de estado que animan tweens distintos y que el ticker
         lee una vez por fotograma. Con varias animaciones escribiendo el mismo
         `clip-path` se pisarían entre ellas. */
      const estado = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        entrada: 0,
        hinchazon: 0,
        respiro: 0,
        empujeScroll: 0,
      }
      const progreso = { valor: 0 }
      const giro = { x: 0, y: 0, objX: 0, objY: 0, activo: false }
      let hayPuntero = false
      let recentrado = false

      /* El centro persigue al puntero con un tween de 0.62 s, NO con una
         interpolación por fotograma. `quickTo` reutiliza el mismo tween en cada
         evento en vez de crear uno nuevo, que es lo que lo hace viable a la
         frecuencia del ratón. */
      const irX = gsap.quickTo(estado, 'x', { duration: PERSECUCION, ease: 'power2.out' })
      const irY = gsap.quickTo(estado, 'y', { duration: PERSECUCION, ease: 'power2.out' })

      /* La respiración de la lente. En bucle y ajena al scroll: con la página
         quieta el hero tiene que seguir vivo. */
      const respirar = gsap.to(estado, {
        respiro: RESPIRO_MAX,
        duration: RESPIRO_CICLO,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      /* La lente no existe al cargar: se abre. */
      const abrir = gsap.to(estado, {
        entrada: 1,
        duration: ENTRADA,
        delay: 0.15,
        ease: 'power2.inOut',
      })

      /* El temporizador de quietud. Cada `pointermove` lo reinicia; solo cuando
         pasan ESPERA_QUIETO segundos sin ninguno, llega a dispararse y desinfla
         la lente. Es la mitad del gesto que yo no tenía. */
      const soltar = gsap
        .delayedCall(ESPERA_QUIETO, () => {
          gsap.to(estado, {
            hinchazon: 0,
            duration: CAIDA,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        })
        .pause()

      let ultX = 0
      let ultY = 0
      let ultT = 0

      const alMover = (e) => {
        const ahora = performance.now()

        /* El primer evento solo siembra la referencia. Sin esto, la primera
           velocidad se calcula contra el origen y sale disparada. */
        if (!hayPuntero) {
          hayPuntero = true
          ultX = e.clientX
          ultY = e.clientY
          ultT = ahora
        }

        irX(e.clientX)
        irY(e.clientY)

        const dt = Math.max(ahora - ultT, 1)
        const velocidad = (Math.hypot(e.clientX - ultX, e.clientY - ultY) / dt) * 1000
        const objetivo = Math.min(
          HINCHAZON_MAX,
          (velocidad / VELOCIDAD_TOPE) * HINCHAZON_MAX,
        )

        /* EL TRINQUETE. Solo se sube, y solo si el objetivo supera de verdad a
           la hinchazón actual —el +1 evita re-disparar el tween por ruido—.
           Bajar es competencia exclusiva de `soltar`. */
        if (objetivo > estado.hinchazon + 1) {
          gsap.to(estado, {
            hinchazon: objetivo,
            duration: SUBIDA,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }

        soltar.restart(true)

        ultX = e.clientX
        ultY = e.clientY
        ultT = ahora

        giro.objY = (e.clientX / window.innerWidth - 0.5) * 2 * GIRO_Y
        giro.objX = -(e.clientY / window.innerHeight - 0.5) * 2 * GIRO_X
        giro.activo = true
        recentrado = false
      }

      if (hayCursor) {
        window.addEventListener('pointermove', alMover, { passive: true })
      }

      const pintar = () => {
        const p = progreso.valor

        /* Con el iris casi lleno se devuelve el centro a la pantalla, para que
           el círculo termine de crecer centrado y la pieza quede en eje. Se
           hace UNA vez —`recentrado`— y por el mismo tween de persecución, así
           que el viaje se ve. */
        if (p > 0.98 && !recentrado) {
          recentrado = true
          giro.activo = false
          hayPuntero = false
          irX(window.innerWidth / 2)
          irY(window.innerHeight / 2)
        }

        /* ── El radio ───────────────────────────────────────────────────
           La fórmula del original, tal cual. Cada sumando lo escribe un tween
           distinto y ninguno sabe de los otros. */
        const radio = Math.max(
          0,
          RADIO_BASE * estado.entrada +
            estado.hinchazon +
            estado.respiro * estado.entrada +
            estado.empujeScroll,
        )

        iris.current.style.clipPath = `circle(${radio.toFixed(1)}px at ${estado.x.toFixed(
          1,
        )}px ${estado.y.toFixed(1)}px)`

        /* El canto de cristal va pegado al mismo círculo y se apaga en cuanto
           el scroll empieza a empujar: pasado cierto tamaño deja de leerse como
           el borde de una lente. */
        if (anillo.current) {
          const escala = radio / RADIO_BASE
          const opacidad =
            estado.entrada * gsap.utils.clamp(0, 1, 1 - estado.empujeScroll / 240)
          anillo.current.style.transform = `translate3d(${estado.x}px, ${estado.y}px, 0) translate(-50%, -50%) scale(${escala.toFixed(3)})`
          anillo.current.style.opacity = opacidad.toFixed(3)
        }

        /* ── La pieza ───────────────────────────────────────────────────
           Centrada durante todo el acto 1; solo se corre según avanza el iris,
           y únicamente si hay ancho para dos columnas. */
        const dosColumnas = window.innerWidth >= ANCHO_DOS_COLUMNAS
        const corrimiento = dosColumnas ? window.innerWidth * CORRIMIENTO_FINAL * p : 0
        capaPieza.current.style.transform = `translate3d(${corrimiento}px, 0, 0)`

        /* El giro se atenúa con la misma curva cúbica del original: manda
           entero hasta el 60 % del iris y desaparece antes de la ficha, donde
           la pieza tiene que estar recta. */
        const at = atenuar(p)
        const destinoY = giro.activo ? giro.objY : 0
        const destinoX = giro.activo ? giro.objX : 0
        giro.y += (destinoY - giro.y) * 0.06
        giro.x += (destinoX - giro.x) * 0.06
        giroPieza.current.style.transform = `rotateY(${(giro.y * at).toFixed(
          2,
        )}deg) rotateX(${(giro.x * at).toFixed(2)}deg)`
      }

      gsap.ticker.add(pintar)

      /* ── El recorrido ────────────────────────────────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: raiz.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      /* El empuje del iris: hasta 1.2 veces la diagonal, que tapa cualquier
         pantalla. `power2.in` —lento al principio, rápido al final— es lo que
         hace que el círculo no salte en cuanto se toca el scroll.
         Función y no número: se reevalúa al redimensionar. */
      tl.to(
        estado,
        {
          empujeScroll: () => 1.2 * Math.hypot(window.innerWidth, window.innerHeight),
          ease: 'power2.in',
          duration: TRAMO_IRIS,
        },
        0,
      )

      tl.to(progreso, { valor: 1, ease: 'power1.inOut', duration: 0.6 }, 0)

      /* El campo marfil se funde cuando el iris ya lo tiene casi todo tapado.
         Es un seguro: sin él, un redondeo del `clip-path` puede dejar un hilo
         claro en un borde. */
      tl.to(velo.current, { opacity: 0, ease: 'none', duration: 0.15 }, APAGA_VELO)

      /* El conjunto crece un 9 %, lineal y sin easing. Tan poco que no se
         percibe como zoom sino como que la pantalla se acerca. */
      tl.to(conjunto.current, { scale: 1.09, duration: 1, ease: 'none' }, 0)

      /* ── La ficha ────────────────────────────────────────────────────
         NO va al scrub. Es una línea de tiempo aparte que se dispara al cruzar
         un umbral y se reproduce a su propia velocidad. Arrastrada por el
         scroll, el texto se quedaba a media opacidad en cuanto alguien se
         detenía encima; disparada, siempre termina de entrar. */
      const partes = ficha.current.querySelectorAll('[data-ficha]')
      const filete = ficha.current.querySelector('[data-filete]')
      gsap.set(partes, { y: 26, opacity: 0 })
      if (filete) gsap.set(filete, { scaleX: 0, transformOrigin: 'left center' })

      const entrada = gsap.timeline({ paused: true })
      entrada.to(partes, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
      })
      if (filete) entrada.to(filete, { scaleX: 1, duration: 0.5 }, 0.2)

      let dentro = false
      tl.eventCallback('onUpdate', () => {
        const p = tl.progress()
        if (!dentro && p > ENTRA_FICHA) {
          dentro = true
          entrada.restart()
        } else if (dentro && p < SALE_FICHA) {
          dentro = false
          entrada.pause(0)
          gsap.set(partes, { y: 26, opacity: 0 })
          if (filete) gsap.set(filete, { scaleX: 0 })
        }
      })

      return () => {
        gsap.ticker.remove(pintar)
        window.removeEventListener('pointermove', alMover)
        respirar.kill()
        abrir.kill()
        soltar.kill()
        entrada.kill()
        tl.scrollTrigger?.kill()
      }
    },
    { scope: raiz, dependencies: [quieto, hayCursor] },
  )

  /* La pieza, en capas anidadas: cada una la escribe algo distinto —el scroll
     la corre, el puntero la gira, un bucle la hace flotar—. Sumadas en un solo
     `transform` habría que recalcular las tres en cada fotograma y se
     pisarían; anidadas, las compone el navegador.

     Sin capas de fondo, a propósito: el campo es un solo obsidiana plano y toda
     la separación la da `SOMBRA`. */
  const mundoOscuro = (
    <div
      ref={capaPieza}
      className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
      style={{ perspective: `${PERSPECTIVA}px` }}
    >
      <div ref={giroPieza} className="relative will-change-transform">
        <div className="relative animate-[flotar_7s_ease-in-out_infinite]">
          <img
            src={PIEZA.id}
            alt={PIEZA.alt}
            fetchPriority="high"
            decoding="async"
            className="relative block"
            style={{
              maxHeight: '52svh',
              maxWidth: '46vw',
              width: 'auto',
              filter: SOMBRA,
            }}
          />
        </div>
      </div>
    </div>
  )

  const bloqueFicha = (
    <div ref={ficha} className="max-w-[34rem]">
      <p data-ficha className="versalita text-nota text-humo">
        01 <span className="mx-2 text-acento">/</span> La pieza
      </p>

      <h2
        data-ficha
        className="mt-5 font-[family-name:var(--font-display)] text-portada leading-[1.08] text-marfil"
      >
        Bolso de mano en relieve de caimán
      </h2>

      <div data-filete aria-hidden="true" className="mt-7 h-px w-[72px] bg-acento/60" />

      <p data-ficha className="mt-7 max-w-[44ch] text-menor leading-relaxed text-humo">
        Solapa cortada con el relieve en el sentido del cuerpo, cantos pintados y
        pulidos a mano, forro de ante vinotinto y correa de muñeca desmontable
        con la placa de iniciales.
      </p>

      <dl data-ficha className="mt-9 flex flex-wrap items-baseline gap-x-10 gap-y-3">
        {[
          ['25 × 20 × 6', 'cm'],
          ['620', 'g'],
          ['4', 'pieles'],
        ].map(([cifra, unidad]) => (
          <div key={unidad} className="flex items-baseline gap-2">
            <dd className="troquel text-mayor text-marfil">{cifra}</dd>
            <dt className="text-nota text-humo">{unidad}</dt>
          </div>
        ))}
      </dl>
    </div>
  )

  /* ── Armado quieto ────────────────────────────────────────────────────
     Sin pin, sin iris y sin lente: el acto 3 entregado ya montado. */
  if (quieto) {
    return (
      <section
        aria-label="Portada"
        className="relative flex min-h-svh items-center overflow-hidden bg-obsidiana"
      >
        {/* El corrimiento va en CSS: aquí el ticker no corre, y sin él la pieza
            quedaría centrada encima del titular. `15vw` = `CORRIMIENTO_FINAL`. */}
        <div className="absolute inset-0 lg:translate-x-[15vw]">{mundoOscuro}</div>
        <div className="canal relative z-10 w-full">{bloqueFicha}</div>
      </section>
    )
  }

  return (
    <section
      ref={raiz}
      aria-label="Portada"
      /* Alto = una pantalla que se ve + el recorrido que se arrastra. El pin es
         la diferencia entre los dos. */
      style={{ height: `${(1 + RECORRIDO) * 100}svh` }}
      className="relative bg-marfil"
    >
      <div ref={conjunto} className="sticky top-0 h-svh overflow-hidden">
        {/* ── ACTO 1 · el campo claro ────────────────────────────────── */}
        <div ref={velo} className="absolute inset-0 z-10 bg-marfil">
          <div className="flex h-full items-center justify-center">
            <h1 className="px-[2vw] text-center font-[family-name:var(--font-display)] text-[13vw] leading-[0.86] tracking-[-0.03em] text-obsidiana">
              MONTESACRO
            </h1>
          </div>

          <div className="canal pointer-events-none absolute inset-x-0 bottom-[clamp(1.5rem,4vw,3rem)] flex items-end justify-between gap-8">
            <p className="font-[family-name:var(--font-display)] text-medio leading-tight text-obsidiana/80">
              Una pieza.
              <br />
              Cuatro pieles.
            </p>

            <p className="versalita hidden text-nota text-obsidiana/45 sm:block">Desplazá</p>

            <p className="versalita text-right text-nota leading-relaxed text-obsidiana/45">
              Marroquinería en piel exótica
              <br />
              Medellín, Colombia
            </p>
          </div>
        </div>

        {/* ── ACTO 2 y 3 · el mundo oscuro tras el círculo ─────────────── */}
        <div
          ref={iris}
          className="absolute inset-0 z-20 flex items-center overflow-hidden bg-obsidiana"
          style={{ clipPath: 'circle(0px at 50% 50%)' }}
        >
          {mundoOscuro}
          <div className="canal relative z-10 w-full">{bloqueFicha}</div>
        </div>

        {/* El canto del cristal, por encima de todo y pegado al mismo círculo.
            Su tamaño en reposo es el diámetro base más un margen: el degradado
            es transparente hasta el 56 %, así que la banda visible cae justo por
            fuera del borde del recorte. */}
        {hayCursor && (
          <div
            ref={anillo}
            aria-hidden="true"
            style={{
              width: RADIO_BASE * 2.7,
              height: RADIO_BASE * 2.7,
              background:
                'radial-gradient(circle, transparent 56%, color-mix(in oklab, var(--color-obsidiana) 14%, transparent) 70%, transparent 84%)',
              opacity: 0,
              transform: 'translate3d(-1000px, -1000px, 0)',
              willChange: 'transform, opacity',
            }}
            className="absolute left-0 top-0 z-30 rounded-full"
          />
        )}
      </div>
    </section>
  )
}
