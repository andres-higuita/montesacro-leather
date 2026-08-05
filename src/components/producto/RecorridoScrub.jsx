import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * El recorrido de la pieza, ligado al scroll.
 *
 * No es un vídeo reproduciéndose: es un índice de fotograma atado a la posición
 * de scroll. Por eso al subir el recorrido va hacia atrás — el visitante manda
 * en los dos sentidos, y eso es lo que hace que el gesto se sienta suyo.
 *
 * Se dibuja en un `<canvas>` y no en un `<video>` con `currentTime`: buscar
 * dentro de un mp4 sesenta veces por segundo se atasca en Safari y en cualquier
 * móvil, porque el decodificador tiene que volver al fotograma clave anterior
 * cada vez. Con una secuencia de imágenes, cada posición ya está decodificada.
 *
 * Los fotogramas NO se descargan al montar: son unos dos megas y la ficha
 * empieza con un vídeo de portada que ya está compitiendo por el ancho de
 * banda. Se piden cuando el bloque está a una pantalla de distancia.
 *
 * Con `prefers-reduced-motion` no hay recorrido ni bloque fijado: se ve un
 * fotograma quieto y los capítulos se leen como una lista.
 */
/* Fuera del componente a propósito: definida dentro, React la trataría como un
   tipo nuevo en cada render y desmontaría los rótulos al cambiar el estado de
   carga — con ellos se irían los nodos que GSAP tiene animando. */
function Capitulo({ capitulo, rotuloRef, className = '' }) {
  return (
    <article ref={rotuloRef} className={className}>
      <p className="troquel text-menor text-oro">[{capitulo.indice}]</p>
      <h3 className="mt-4 flex gap-4 font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
        <span aria-hidden="true" className="text-oro">/</span>
        <span>{capitulo.titulo}</span>
      </h3>
      <p className="mt-4 text-menor leading-relaxed text-humo">{capitulo.texto}</p>
    </article>
  )
}

export default function RecorridoScrub({
  secuencia,
  capitulos,
  alt,
  recorrido = 4,
  className = '',
  id,
  /* Ancho máximo del fotograma, en píxeles CSS. Sin esto el lienzo va a sangre,
     y a sangre solo puede ir metraje con resolución de sobra.
     La cuenta: una pantalla retina de 1905 px CSS son 3810 píxeles reales. Un
     plano de 720p llenándola se amplía 3×, y a 3× el grano de la piel se
     deshace. Apple no pone su scrub a sangre por lo mismo: su plano mide
     1010×1360 dentro de una columna, en una tarjeta de esquinas redondeadas.
     Con `anchoPlaca` el fotograma se dibuja a su tamaño, centrado sobre el
     negro del sitio, y lo que se ve es nítido en vez de grande. */
  anchoPlaca,
  /* Techo de ampliación, en píxeles reales por píxel del fotograma. 1.25 es el
     valor de la casa para el metraje maestro. Un plano que se dibuja como placa
     ya no necesita techo bajo —no se está estirando— y con 2 se permite el 1:1
     en CSS sobre pantalla retina, que es lo que hace cualquier imagen normal. */
  nitidez = 1.25,
}) {
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const rotulos = useRef([])
  const fotogramas = useRef([])
  const fondo = useRef('#000000')
  const [cargando, setCargando] = useState(true)
  /* Se decide al montar y no dentro del efecto: de esto depende el ARMADO del
     bloque —fijado y rótulos superpuestos, o una imagen quieta con los
     capítulos en columna—, no solo si hay animación. */
  const [quieto] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(
    () => {
      const canvas = lienzo.current
      const ctx = canvas.getContext('2d')
      const estado = { p: 0 }

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
        // El metraje se reescala: sin esto el canvas remuestrea con el filtro
        // barato y el grano de la piel se convierte en papilla.
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
      }

      const pintar = () => {
        const p = gsap.utils.clamp(0, 1, estado.p)
        const i = Math.round(p * (secuencia.total - 1))
        const img = fotogramas.current[i]
        if (!img?.complete || !img.naturalWidth) return

        // Se rellena con el negro DEL FOTOGRAMA, no con el del tema: el JPEG no
        // comprime a #000 exacto y sobre otro negro se veía el rectángulo del
        // encuadre recortado.
        ctx.fillStyle = fondo.current
        ctx.fillRect(0, 0, ancho, alto)

        /* `contain` con techo de ampliación. Sin el techo, en un monitor grande
           el fotograma se estira muy por encima de su resolución real y la piel
           se deshace. La cuenta va en píxeles de dispositivo: dibujar a `w` de
           ancho ocupa `w × densidad` píxeles reales. */
        const vertical = ancho / alto < (img.width / img.height) * 0.8
        const escala = vertical
          ? ancho / img.width
          : Math.min(ancho / img.width, alto / img.height, nitidez / densidad)

        const w = img.width * escala
        const h = img.height * escala
        // En vertical la pieza sube al 38% del alto: la mitad baja queda para
        // el capítulo, sin que el texto se monte sobre la piel.
        const y = vertical ? alto * 0.38 - h / 2 : (alto - h) / 2
        ctx.drawImage(img, (ancho - w) / 2, y, w, h)
      }

      medir()

      /* ── Descarga, cuando el bloque ya está cerca ─────────────────── */
      /** Toma el color de una esquina del fotograma: ahí solo hay fondo. */
      const muestrearFondo = (img) => {
        try {
          const aux = document.createElement('canvas')
          aux.width = 1
          aux.height = 1
          const auxCtx = aux.getContext('2d', { willReadFrequently: true })
          auxCtx.drawImage(img, 2, 2, 1, 1, 0, 0, 1, 1)
          const [r, g, b] = auxCtx.getImageData(0, 0, 1, 1).data
          fondo.current = `rgb(${r}, ${g}, ${b})`
        } catch {
          /* lienzo contaminado: se queda el negro por defecto */
        }
      }

      const descargar = () => {
        if (fotogramas.current.length) return

        // Los primeros mandan: son los que se ven antes de tocar el scroll. El
        // resto sigue llegando por detrás mientras el visitante lee.
        const SUFICIENTE = Math.min(12, secuencia.total)
        let listos = 0

        const contar = function () {
          listos += 1
          if (listos === 1) {
            muestrearFondo(this)
            pintar()
          }
          if (listos === SUFICIENTE) setCargando(false)
          if (listos === secuencia.total) ScrollTrigger.refresh()
        }

        fotogramas.current = Array.from({ length: secuencia.total }, (_, i) => {
          const img = new Image()
          img.fetchPriority = i < SUFICIENTE ? 'high' : 'low'
          img.decoding = 'async'
          img.src = secuencia.ruta(i)
          img.onload = contar
          img.onerror = contar
          return img
        })
      }

      const disparoDeCarga = ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top bottom+=100%',
        once: true,
        onEnter: descargar,
      })

      const alRedimensionar = () => {
        medir()
        pintar()
      }
      window.addEventListener('resize', alRedimensionar)

      /* ── Movimiento ──────────────────────────────────────────────── */
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Sin recorrido: se muestra un fotograma del medio, donde la pieza ya
        // está abierta, y los capítulos quedan visibles todos a la vez.
        descargar()
        estado.p = 0.5
        pintar()
        gsap.set(rotulos.current, { opacity: 1, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.55,
          },
        })

        tl.to(estado, { p: 1, duration: 1, ease: 'none', onUpdate: pintar }, 0)

        /* Cada capítulo manda desde su marca hasta la del siguiente. Entra un
           pelo antes de su marca y sale un pelo antes de la siguiente, para que
           nunca haya dos rótulos a la vez ni un hueco sin ninguno. */
        capitulos.forEach((capitulo, i) => {
          const nodo = rotulos.current[i]
          if (!nodo) return
          const fin = capitulos[i + 1]?.en ?? 1

          tl.fromTo(
            nodo,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.06, ease: 'none' },
            Math.max(0, capitulo.en - 0.04),
          )

          if (fin < 1) {
            tl.to(nodo, { opacity: 0, duration: 0.05, ease: 'none' }, fin - 0.06)
          }
        })

        return () => tl.scrollTrigger?.kill()
      })

      return () => {
        window.removeEventListener('resize', alRedimensionar)
        disparoDeCarga.kill()
        mm.revert()
      }
    },
    { scope: raiz, dependencies: [secuencia, capitulos, nitidez, anchoPlaca] },
  )

  const guardarRotulo = (i) => (nodo) => {
    rotulos.current[i] = nodo
  }

  /* Armado quieto: un fotograma parado y los capítulos en columna. Sin
     recorrido no hay nada que relevar, así que los tres se leen de una vez. */
  if (quieto) {
    return (
      <section ref={raiz} id={id} className={`bg-black ${className}`}>
        <div className="relative h-[62svh]">
          <canvas
            ref={lienzo}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={alt}
          />
        </div>

        <div className="canal grid gap-12 py-[clamp(3rem,7vw,5rem)] sm:grid-cols-3">
          {capitulos.map((capitulo, i) => (
            <Capitulo
              key={capitulo.indice}
              capitulo={capitulo}
              rotuloRef={guardarRotulo(i)}
              className="max-w-[46ch]"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={raiz}
      id={id}
      aria-label="Recorrido de la pieza"
      style={{ height: `${recorrido * 100}svh` }}
      className={`relative bg-black ${className}`}
    >
      {/* Fijado, no fijo: el bloque se queda clavado mientras dura SU recorrido
          y después suelta la pantalla a la sección siguiente. */}
      {/* Con placa el fotograma se alinea arriba y no al centro: los capítulos
          ocupan la franja baja de la pantalla y centrado se les montaba encima. */}
      <div
        className={`sticky top-0 flex h-svh overflow-hidden ${
          anchoPlaca ? 'items-start pt-[7svh]' : 'items-center'
        }`}
      >
        {/* La placa: el fotograma a su tamaño, centrado sobre el negro del
            sitio, con las esquinas redondeadas de la casa. Sin `anchoPlaca` el
            lienzo vuelve a ir a sangre, que es lo que quiere el metraje maestro. */}
        <div
          className={
            anchoPlaca
              ? 'relative mx-auto w-full overflow-hidden rounded-ficha'
              : 'absolute inset-0'
          }
          style={anchoPlaca ? { maxWidth: `${anchoPlaca}px`, aspectRatio: '16 / 9' } : undefined}
        >
          <canvas
            ref={lienzo}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={alt}
          />
        </div>

        {cargando && (
          <p
            className="versalita absolute inset-0 flex items-center justify-center text-nota text-humo"
            role="status"
          >
            Cargando el recorrido
          </p>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56svh] bg-gradient-to-t from-black via-black/80 to-transparent"
        />

        {/* Los capítulos ocupan todos el mismo sitio y se relevan. Apilarlos en
            una columna los convertiría en una lista, y aquí cada uno tiene que
            mandar solo mientras se ve lo que describe. */}
        <div className="canal absolute inset-x-0 bottom-0 pb-[clamp(2.5rem,7vw,5rem)]">
          <div className="relative min-h-[14rem] sm:min-h-[11rem]">
            {capitulos.map((capitulo, i) => (
              <Capitulo
                key={capitulo.indice}
                capitulo={capitulo}
                rotuloRef={guardarRotulo(i)}
                className="absolute inset-x-0 bottom-0 max-w-[46ch] opacity-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
