import { useEffect, useRef, useState } from 'react'

/**
 * Portada de la ficha: el metraje de la pieza a pantalla completa.
 *
 * El clip dura menos de tres segundos y NO va en bucle. Un bucle corto delata
 * el corte —el plano vuelve de golpe al principio— y convierte la pieza en un
 * GIF. Aquí se reproduce una vez, se queda en su último fotograma, y a partir
 * de ahí solo queda un empuje de cámara lentísimo hecho con CSS: la escena
 * sigue respirando sin repetirse.
 *
 * El nombre va ARRIBA y la lectura abajo, con la pieza entera en medio. Es el
 * reparto de una portada de producto: primero qué es, después por qué.
 *
 * Con `prefers-reduced-motion` el vídeo no arranca —se queda el póster, que es
 * el primer fotograma— y el empuje de cámara se anula desde el CSS global.
 */
export default function PortadaPieza({ producto, escena, precio }) {
  const video = useRef(null)
  const [entrada, setEntrada] = useState(false)

  const conVideo = Boolean(escena.video)

  /* El empuje de cámara por CSS existe porque los clips recortados del metraje
     maestro se quedan quietos en su último fotograma y la portada necesita
     seguir respirando. Un clip con movimiento de cámara PROPIO no lo necesita, y
     sumar los dos recorta la pieza: el 1.09× del CSS se multiplica por el
     acercamiento del propio plano y la solapa abierta se sale del encuadre. */
  const empuje = escena.empuje === false ? '' : 'empuje-lento'
  const velosSuaves = escena.velos === 'suave'

  useEffect(() => {
    const v = video.current
    if (!v) return

    /* No se usa el atributo `autoplay`: con movimiento reducido el vídeo no
       debe arrancar nunca, y el atributo lo pondría en marcha antes de que
       este efecto pueda pararlo. */
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)')

    /* A 0.6× por defecto. Los clips recortados del metraje maestro duran menos
       de un segundo —son un plano de un plano, no una pieza pensada como
       portada— y a velocidad normal el movimiento de cámara se lee como un
       tirón. Ralentizado, el mismo plano dura lo que dura una portada.
       La pieza que tiene metraje propio lo pone a 1 en escenas.js: un clip que
       ya dura siete segundos ralentizado se hace eterno. */
    v.playbackRate = escena.velocidad ?? 0.6

    const aplicar = () => {
      if (menosMovimiento.matches) v.pause()
      // Safari rechaza la promesa mientras no haya interacción; el vídeo va en
      // silencio, así que en la práctica solo ocurre con ahorro de datos. En
      // ese caso se queda el póster, que es un fotograma real de la pieza.
      else v.play().catch(() => {})
    }

    aplicar()
    menosMovimiento.addEventListener('change', aplicar)
    return () => menosMovimiento.removeEventListener('change', aplicar)
  }, [escena.video, escena.velocidad])

  /* El texto entra un instante después del primer fotograma. Entrar a la vez
     que la imagen los pone a competir; entrar después deja que la pieza se
     lea primero, que es el orden que quiere una portada de producto. */
  useEffect(() => {
    const t = setTimeout(() => setEntrada(true), 260)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      aria-label={`${producto.nombre}. ${escena.divisa}`}
      className="relative h-svh overflow-hidden bg-black"
    >
      {/* Encaje: `cover` en apaisado —el metraje es 16:9 y casi ningún monitor
          lo es— y `contain` subido al 38% en vertical, donde `cover` recortaría
          la pieza por los lados y dejaría el bodegón partido. */}
      {conVideo ? (
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          poster={escena.poster}
          aria-label={escena.alt}
          className={`${empuje} absolute inset-0 h-full w-full object-cover [@media(max-aspect-ratio:4/5)]:object-contain [@media(max-aspect-ratio:4/5)]:object-[center_38%]`}
        >
          <source src={escena.video} type="video/mp4" />
        </video>
      ) : (
        /* Pieza sin metraje propio: la portada la sostiene la fotografía con el
           mismo empuje de cámara. Es preferible a montar un vídeo de otra pieza
           parecida — ver el porqué en la entrada del bolso, en escenas.js. */
        <img
          src={escena.fotoPortada.id}
          alt={escena.fotoPortada.alt}
          fetchPriority="high"
          className={`${empuje} absolute inset-0 h-full w-full object-cover [@media(max-aspect-ratio:4/5)]:object-contain [@media(max-aspect-ratio:4/5)]:object-[center_38%]`}
        />
      )}

      {/* Velos. El de arriba sostiene el encabezado flotante y el nombre; el de
          abajo, la lectura y el precio. Sin ellos, sobre una escama iluminada
          los dos quedan ilegibles.
          Los valores fuertes están calibrados contra el metraje maestro, que es
          de piezas claras sobre fondo claro. Sobre una pieza NEGRA en un fondo
          cálido apagan el producto hasta dejarlo en una mancha, así que esa
          escena pide `velos: 'suave'`: lo justo para el texto y nada más. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 ${
          velosSuaves
            ? 'h-[34svh] bg-gradient-to-b from-black/92 via-black/45 to-transparent'
            : 'h-[46svh] bg-gradient-to-b from-black via-black/70 to-transparent'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 ${
          velosSuaves
            ? 'h-[42svh] bg-gradient-to-t from-black via-black/58 to-transparent'
            : 'h-[50svh] bg-gradient-to-t from-black via-black/76 to-transparent'
        }`}
      />
      {/* Velo lateral. El metraje es de plano cerrado y la pieza puede caer en
          cualquier mitad del encuadre: sobre una piel marfil iluminada, el
          nombre en marfil desaparece. Este velo garantiza la columna izquierda
          pase lo que pase detrás, sin oscurecer la pieza. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 ${
          velosSuaves
            ? 'w-[56%] bg-gradient-to-r from-black/78 via-black/22 to-transparent lg:w-[44%]'
            : 'w-[70%] bg-gradient-to-r from-black/88 via-black/45 to-transparent lg:w-[58%]'
        }`}
      />

      {/* Nombre, arriba */}
      <div
        className={`canal pointer-events-none absolute inset-x-0 top-[clamp(6.5rem,14vh,10rem)] transition-all duration-[1100ms] ease-[var(--ease-salida)] ${
          entrada ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <p className="versalita text-nota text-oro">{producto.familia}</p>
        <h1 className="mt-4 max-w-[16ch] font-[family-name:var(--font-display)] text-portada leading-[1.04] text-marfil">
          {producto.nombre}
        </h1>
        <p className="mt-5 max-w-[30ch] text-medio leading-relaxed text-marfil/82">
          {escena.divisa}
        </p>
      </div>

      {/* Precio, pista de scroll y lectura, abajo */}
      <div className="canal absolute inset-x-0 bottom-0 pb-[clamp(2.25rem,6vw,4rem)]">
        <div
          className={`grid items-end gap-8 transition-all delay-200 duration-[1100ms] ease-[var(--ease-salida)] lg:grid-cols-[1fr_auto_0.9fr] lg:gap-14 ${
            entrada ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <div>
            <p className="troquel text-mayor text-marfil">{precio}</p>
            <p className="mt-2 text-nota text-humo">
              {producto.colorways.length} pieles · fabricación por encargo
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none hidden flex-col items-center gap-2.5 pb-3 lg:flex"
          >
            <span className="versalita text-nota text-humo">Bajar</span>
            <span className="block h-10 w-px bg-gradient-to-b from-transparent to-oro" />
          </div>

          <div className="lg:pb-2">
            <p className="max-w-[40ch] text-menor leading-relaxed text-humo">
              {producto.resumen}
            </p>
            <a
              href="#configurar"
              className="versalita mt-6 inline-block border-b border-oro pb-1.5 text-menor text-marfil transition-colors duration-400 hover:text-oro"
            >
              Configurar la pieza
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
