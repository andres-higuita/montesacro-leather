import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { leerColor } from '../../lib/color'
import { FRAGMENTO, VERTICE, VERTICES } from './escamas'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Atmósfera: luz viva detrás de una sección.
 *
 * Envuelve contenido y le pone debajo un lienzo WebGL que dibuja luz rozando
 * una piel de caimán (ver `escamas.js`). El foco baja con el scroll y el
 * cursor lo empuja de lado: la superficie se inclina bajo la mano, no se
 * enciende una linterna.
 *
 * WEBGL CRUDO Y NO THREE.JS
 * Esto es un cuadrilátero a pantalla completa con un fragment shader. No hay
 * escena, ni cámara, ni malla, ni luces, ni materiales: nada de lo que una
 * biblioteca 3D existe para administrar. Meter three.js aquí serían unos 600 kB
 * comprimidos para no usar el 98% de ellos. El modelo 3D de la pieza —que sí
 * necesita todo eso— carga three.js en su propio trozo, y solo en la ruta
 * donde aparece.
 *
 * SE COMPONE SUMANDO
 * El shader no pinta un fondo: pinta la luz que se añade al negro que la
 * página ya tiene. Alfa premultiplicado y el navegador componiendo con
 * `origen + destino·(1-alfa)`. Consecuencia práctica: donde no hay efecto el
 * lienzo es invisible de verdad, así que nunca se ve el rectángulo de un negro
 * ligeramente distinto encima de otro. Es el fallo clásico de estas capas.
 *
 * NO CORRE SI NO SE VE
 * El lienzo solo dibuja cuando está en pantalla —`IntersectionObserver`— y va
 * atado al ticker de GSAP, el mismo reloj que mueve a Lenis y al scrub. Con su
 * propio `requestAnimationFrame` el efecto iría un fotograma por detrás del
 * scroll y se leería como retraso.
 *
 * Con `prefers-reduced-motion` se dibuja UN fotograma y se para: la textura
 * sigue ahí, el movimiento no.
 */
export default function Atmosfera({
  /* Mando de volumen, 0 a 1. Vale la pena bajarlo cuando encima va texto
     largo: el efecto tiene que sostener la lectura, no competir con ella. */
  fuerza = 1,
  /* Alto del lienzo respecto al bloque. Por encima de 1 el efecto sangra por
     arriba y por abajo, y la sección no empieza con una junta horizontal. */
  desborde = '0px',
  className = '',
  children,
}) {
  const raiz = useRef(null)
  const lienzo = useRef(null)
  /* Se decide al montar, no dentro del efecto: con movimiento reducido no se
     instala ni el ticker ni el rastreo del cursor, no es solo que se congele. */
  const [quieto] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(
    () => {
      const canvas = lienzo.current
      if (!canvas) return

      const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        // El shader no tiene un solo borde geométrico: no hay nada que suavizar.
        antialias: false,
        depth: false,
        stencil: false,
        // Un fondo decorativo no merece despertar la GPU discreta de un portátil.
        powerPreference: 'low-power',
      })
      /* Sin WebGL —contexto agotado, GPU en lista negra, extensión bloqueada—
         la sección se queda exactamente como estaba: negra. El contenido va en
         su propia capa y no depende de esto para nada. */
      if (!gl) return

      /* ── Construcción de los recursos de GPU ──────────────────────────────
         En una función aparte porque hay que poder repetirla entera: si el
         sistema recupera la GPU tras una suspensión, el contexto se pierde y
         TODOS los objetos —programa, búfer, uniforms— quedan muertos. */
      let recursos = null

      const compilar = (tipo, fuente) => {
        const shader = gl.createShader(tipo)
        gl.shaderSource(shader, fuente)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          if (import.meta.env.DEV) {
            console.error('[Atmósfera] shader:', gl.getShaderInfoLog(shader))
          }
          gl.deleteShader(shader)
          return null
        }
        return shader
      }

      const construir = () => {
        const vs = compilar(gl.VERTEX_SHADER, VERTICE)
        const fs = compilar(gl.FRAGMENT_SHADER, FRAGMENTO)
        if (!vs || !fs) return null

        const programa = gl.createProgram()
        gl.attachShader(programa, vs)
        gl.attachShader(programa, fs)
        gl.linkProgram(programa)
        /* Los shaders se borran en cuanto están enlazados: el programa ya tiene
           su copia compilada y estos son solo la fuente. */
        gl.deleteShader(vs)
        gl.deleteShader(fs)

        if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
          if (import.meta.env.DEV) {
            console.error('[Atmósfera] enlace:', gl.getProgramInfoLog(programa))
          }
          gl.deleteProgram(programa)
          return null
        }

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW)

        const vertice = gl.getAttribLocation(programa, 'a_vertice')
        gl.enableVertexAttribArray(vertice)
        gl.vertexAttribPointer(vertice, 2, gl.FLOAT, false, 0, 0)

        gl.useProgram(programa)

        return {
          programa,
          buffer,
          u: {
            res: gl.getUniformLocation(programa, 'u_res'),
            tiempo: gl.getUniformLocation(programa, 'u_tiempo'),
            cursor: gl.getUniformLocation(programa, 'u_cursor'),
            avance: gl.getUniformLocation(programa, 'u_avance'),
            fuerza: gl.getUniformLocation(programa, 'u_fuerza'),
            oro: gl.getUniformLocation(programa, 'u_oro'),
            vino: gl.getUniformLocation(programa, 'u_vino'),
          },
        }
      }

      recursos = construir()
      if (!recursos) return

      /* ── Los colores, tomados del tema ───────────────────────────────────
         No hay hex escritos aquí: se leen los ROLES desde la raíz del bloque,
         que es donde manda el mundo material que tenga puesto la sección. Si
         mañana `--color-acento` cambia, el shader cambia con él.
         Los respaldos son los valores del tema piel, por si la lectura falla. */
      const oro = leerColor('--color-acento', [0.78, 0.62, 0.33], raiz.current)
      const vino = leerColor('--color-realce', [0.31, 0.13, 0.17], raiz.current)

      /* ── Tamaño ──────────────────────────────────────────────────────────
         Se mide con ResizeObserver y NO en cada fotograma: leer el rectángulo
         del nodo obliga al navegador a recalcular la maquetación, y hacerlo
         sesenta veces por segundo para un dato que casi nunca cambia es el
         camino corto a que el scroll se sienta pesado. */
      let ancho = 0
      let alto = 0

      const medir = () => {
        /* Techo de densidad en 1.5. Cada píxel de este shader paga cuatro
           octavas de ruido dos veces —el warp y el grano—; a densidad 3 en un
           teléfono son nueve veces los píxeles de una pantalla normal para un
           efecto que no tiene un solo borde nítido que ganar con ello. */
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        const caja = canvas.getBoundingClientRect()
        const w = Math.max(1, Math.round(caja.width * dpr))
        const h = Math.max(1, Math.round(caja.height * dpr))
        if (w === ancho && h === alto) return
        ancho = w
        alto = h
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }

      medir()

      /* ── Estado que el shader lee cada fotograma ─────────────────────────── */
      const estado = { avance: 0 }
      // El cursor arranca en el centro: en táctil no hay puntero y la escena
      // tiene que verse igual de viva sin que nadie la toque.
      const cursor = { x: 0.5, y: 0.5 }
      const destino = { x: 0.5, y: 0.5 }

      const dibujar = (tiempo) => {
        const { u } = recursos
        gl.uniform2f(u.res, ancho, alto)
        gl.uniform1f(u.tiempo, tiempo)
        gl.uniform2f(u.cursor, cursor.x, cursor.y)
        gl.uniform1f(u.avance, estado.avance)
        gl.uniform1f(u.fuerza, fuerza)
        gl.uniform3fv(u.oro, oro)
        gl.uniform3fv(u.vino, vino)

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }

      /* ── Recorrido del scroll ────────────────────────────────────────────
         De borde a borde de la ventana: el efecto empieza a moverse cuando la
         sección asoma por abajo y termina cuando sale por arriba. No se usa
         `scrub` ni una timeline porque no hay nada que interpolar — el valor se
         lee crudo y el suavizado ya lo pone Lenis. */
      const recorrido = ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          estado.avance = self.progress
        },
      })

      /* ── Movimiento reducido: un fotograma y punto ───────────────────────── */
      if (quieto) {
        // Un instante cualquiera del campo, con la luz a media altura. Se ve la
        // textura de la piel, no se ve moverse.
        estado.avance = 0.4
        dibujar(11.7)

        const observador = new ResizeObserver(() => {
          medir()
          dibujar(11.7)
        })
        observador.observe(canvas)

        return () => {
          observador.disconnect()
          recorrido.kill()
          gl.deleteProgram(recursos.programa)
          gl.deleteBuffer(recursos.buffer)
        }
      }

      /* ── Movimiento ──────────────────────────────────────────────────────── */
      let visible = false
      let perdido = false

      const alTicker = (tiempo, delta) => {
        if (!visible || perdido || !recursos) return

        /* Suavizado del cursor independiente de la tasa de fotogramas. Con un
           `lerp` de factor fijo la luz seguiría el ratón al doble de velocidad
           en un monitor de 120 Hz que en uno de 60. Con la exponencial, el
           tiempo de asentamiento es el mismo en los dos: medio segundo. */
        const k = 1 - Math.pow(0.0025, delta / 1000)
        cursor.x += (destino.x - cursor.x) * k
        cursor.y += (destino.y - cursor.y) * k

        dibujar(tiempo)
      }

      const observadorVista = new IntersectionObserver(
        ([entrada]) => {
          visible = entrada.isIntersecting
        },
        /* Un margen de media pantalla: el primer fotograma se dibuja antes de
           que el bloque asome, no en el momento en que ya se está viendo. */
        { rootMargin: '50% 0px' },
      )
      observadorVista.observe(canvas)

      const observadorTamano = new ResizeObserver(medir)
      observadorTamano.observe(canvas)

      const alMover = (evento) => {
        /* Se lee el rectángulo aquí y no en el ticker: los eventos de puntero
           ya vienen limitados a la tasa de refresco, así que es una lectura por
           fotograma como mucho, y solo mientras la mano se mueve. */
        const caja = canvas.getBoundingClientRect()
        destino.x = (evento.clientX - caja.left) / caja.width
        // Invertida: en WebGL el origen está abajo.
        destino.y = 1 - (evento.clientY - caja.top) / caja.height
      }
      const bloque = raiz.current
      bloque.addEventListener('pointermove', alMover, { passive: true })

      /* ── Pérdida de contexto ─────────────────────────────────────────────
         Pasa de verdad: el portátil suspende, el sistema reinicia el driver, o
         el navegador recicla el contexto más viejo cuando hay demasiados. Sin
         `preventDefault` el navegador ni siquiera intenta recuperarlo. */
      const alPerder = (evento) => {
        evento.preventDefault()
        perdido = true
        recursos = null
      }

      const alRecuperar = () => {
        recursos = construir()
        if (!recursos) return
        ancho = 0
        alto = 0
        medir()
        perdido = false
      }

      canvas.addEventListener('webglcontextlost', alPerder)
      canvas.addEventListener('webglcontextrestored', alRecuperar)

      gsap.ticker.add(alTicker)

      return () => {
        gsap.ticker.remove(alTicker)
        bloque.removeEventListener('pointermove', alMover)
        canvas.removeEventListener('webglcontextlost', alPerder)
        canvas.removeEventListener('webglcontextrestored', alRecuperar)
        observadorVista.disconnect()
        observadorTamano.disconnect()
        recorrido.kill()
        if (recursos) {
          gl.deleteProgram(recursos.programa)
          gl.deleteBuffer(recursos.buffer)
        }
        /* AQUÍ NO SE LLAMA A `WEBGL_lose_context.loseContext()`.
           Parece lo correcto —soltar el contexto en vez de esperar al
           recolector— y es una trampa: una vez perdido a mano, `getContext`
           sobre ESE MISMO <canvas> devuelve el contexto muerto, no uno nuevo.
           Como el nodo sobrevive a la limpieza del efecto, cualquier cosa que
           lo vuelva a ejecutar —el doble montaje de StrictMode en desarrollo,
           un cambio de `fuerza` en producción— reconstruye el programa contra
           un contexto perdido y la sección se queda negra para siempre, sin un
           solo error en consola.
           Al desmontar de verdad, React se lleva el <canvas> y el contexto se
           libera con él, que era todo lo que hacía falta. */
      }
    },
    { scope: raiz, dependencies: [fuerza, quieto] },
  )

  return (
    <div ref={raiz} className={`relative isolate ${className}`}>
      {/* El desborde va en un envoltorio posicionado y el lienzo lo llena al
          100%. Directamente sobre el `<canvas>` no funcionaría: es un elemento
          reemplazado, así que con `width: auto` se queda en su tamaño
          intrínseco —300×150— por mucho que se fijen los cuatro lados.

          `-z-10` para quedar bajo el contenido sin sacarlo de la pila general:
          el `isolate` de la raíz encierra la capa aquí dentro, así que no
          compite con el encabezado flotante ni con el cajón del carrito. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -z-10 overflow-hidden"
        style={{ top: `-${desborde}`, bottom: `-${desborde}` }}
      >
        <canvas ref={lienzo} className="h-full w-full" />
      </div>
      {children}
    </div>
  )
}
