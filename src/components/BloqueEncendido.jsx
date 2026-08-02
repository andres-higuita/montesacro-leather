import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

/**
 * Bloque que se enciende al subir.
 *
 * MEDIDO SOBRE MORAE, en su sección de rasgos numerados:
 *
 *   top / alto de pantalla → opacidad
 *   0.449 → 0.53
 *   0.378 → 0.52
 *   0.307 → 0.778
 *   0.235 → 1.00
 *   por encima → 1.00
 *
 * Es decir: el bloque vive al 50% mientras está en la mitad baja de la
 * pantalla y se enciende del todo en un tramo corto, entre el 38% y el 23% de
 * la altura. Nunca vuelve a apagarse al salir por arriba, y no lleva ningún
 * `transform` — la opacidad es toda la animación.
 *
 * Leído desde el sitio: lo que está por llegar se insinúa; lo que está a la
 * altura de la mirada manda. Eso es lo que hace que una columna larga de
 * bloques se lea de uno en uno en vez de todos a la vez.
 */

const ENTRADA = 0.38 // empieza a encenderse a esta fracción de la pantalla
const PLENO = 0.23 // aquí ya está al 100%
const APAGADO = 0.5 // opacidad en reposo

export default function BloqueEncendido({ children, className = '', as = 'div' }) {
  const referencia = useRef(null)
  const reducido = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: referencia,
    offset: [`start ${ENTRADA}`, `start ${PLENO}`],
  })

  const opacidad = useTransform(scrollYProgress, [0, 1], [APAGADO, 1])

  if (reducido) {
    const Simple = as
    return <Simple className={className}>{children}</Simple>
  }

  const Etiqueta = motion[as] ?? motion.div

  return (
    <Etiqueta ref={referencia} className={className} style={{ opacity: opacidad }}>
      {children}
    </Etiqueta>
  )
}
