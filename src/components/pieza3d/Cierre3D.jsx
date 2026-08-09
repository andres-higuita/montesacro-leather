import { lazy, Suspense, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { leerColor } from '../../lib/color'
import Foto from '../Foto'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * El cierre en 3D — o la fotografía, según a quién le toque.
 *
 * Este componente NO dibuja nada: decide. La escena de verdad vive en
 * `EscenaCierre.jsx` y con ella vienen three.js, React Three Fiber y drei, que
 * son unos 170 kB comprimidos. Aquí se controla cuándo —y si— se pagan.
 *
 * TRES CAMINOS
 *
 * 1. Movimiento reducido → la fotografía, y three.js no se descarga nunca.
 *    Un objeto que gira solo es exactamente lo que esa preferencia pide evitar.
 * 2. El bloque está lejos → la fotografía, y three.js tampoco se descarga.
 *    Es la sección cuarta del inicio: casi nadie que abra la portada llega.
 * 3. El bloque se acerca → se pide el trozo, y la fotografía se queda de
 *    respaldo hasta que la escena esté lista.
 *
 * La consecuencia importante: el paquete de entrada del sitio no cambia de
 * tamaño. Quien entra a comprar y no baja hasta aquí no paga un motor 3D.
 *
 * EL RELOJ SE PARA
 * Fuera de pantalla el bucle de render pasa a `never`. Sin eso, un lienzo WebGL
 * sigue sombreando sesenta veces por segundo cuatro secciones más abajo — es
 * de las formas más rápidas que hay de vaciar la batería de un teléfono.
 */
const EscenaCierre = lazy(() => import('./EscenaCierre'))

export default function Cierre3D({
  /* La fotografía de estudio de la pieza. No es un plan B de emergencia: es lo
     que ven el movimiento reducido y los primeros segundos de todos los demás,
     así que tiene que ser buena por su cuenta. */
  respaldo,
  alt,
  className = '',
}) {
  const raiz = useRef(null)
  /* El recorrido va en una referencia y no en estado. Cambia con cada golpe de
     scroll; en estado, cada uno de esos golpes volvería a renderizar el árbol
     de React para mover una rotación que three.js administra por su cuenta. */
  const avance = useRef(0)

  const [quieto] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [cerca, setCerca] = useState(false)
  const [enPantalla, setEnPantalla] = useState(false)
  /* Respaldo: el dorado del tema piel. Se sustituye en cuanto el efecto puede
     leer el valor real desde el nodo —hay que esperar a tenerlo montado para
     que los mundos materiales que reasignan los roles cuenten. */
  const [oro, setOro] = useState([0.78, 0.62, 0.33])

  useGSAP(
    () => {
      if (quieto) return

      setOro(leerColor('--color-acento', [0.78, 0.62, 0.33], raiz.current))

      /* Una pantalla de antelación para pedir el trozo. Es el mismo margen con
         el que el recorrido de la ficha pide sus fotogramas: da tiempo a que
         llegue y se compile el shader antes de que haga falta, sin adelantarlo
         tanto que se descargue para nadie. */
      const disparoDeCarga = ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top bottom+=100%',
        once: true,
        onEnter: () => setCerca(true),
      })

      const recorrido = ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          avance.current = self.progress
        },
        onToggle: (self) => setEnPantalla(self.isActive),
      })

      return () => {
        disparoDeCarga.kill()
        recorrido.kill()
      }
    },
    { scope: raiz, dependencies: [quieto] },
  )

  const fotografia = (
    <Foto imagen={respaldo} ratio="1 / 1" sizes="(min-width: 64rem) 46vw, 100vw" className="w-full" />
  )

  return (
    <div ref={raiz} className={`relative aspect-square w-full ${className}`}>
      {quieto || !cerca ? (
        fotografia
      ) : (
        /* El respaldo de `Suspense` es la misma fotografía: mientras el trozo
           viaja no hay ni hueco ni rueda girando, hay la pieza. */
        <Suspense fallback={fotografia}>
          <EscenaCierre
            avance={avance}
            oro={oro}
            reloj={enPantalla ? 'always' : 'never'}
          />
          {/* El lienzo de WebGL no es un `<img>`: para un lector de pantalla no
              existe. La descripción de la pieza tiene que estar en el documento
              igualmente, y va aquí. */}
          <p className="sr-only">{alt}</p>
        </Suspense>
      )}
    </div>
  )
}
