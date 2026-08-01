import { motion, useReducedMotion } from 'motion/react'

/**
 * Gramática de entrada única del sitio: subir 16px, 0.7s, ease-salida.
 *
 * `indice` escalona los elementos DENTRO de una lista. No se usa para
 * escalonar secciones entre sí: eso produce el tic de "cada sección aparece
 * igual" que el sistema evita.
 *
 * Con `prefers-reduced-motion: reduce` el contenido nace visible y no se
 * anima en absoluto — nunca queda oculto esperando un observador.
 */
export default function Reveal({
  children,
  indice = 0,
  distancia = 16,
  duracion = 0.7,
  className = '',
  as = 'div',
}) {
  const reducido = useReducedMotion()
  const Etiqueta = motion[as] ?? motion.div

  if (reducido) {
    const Simple = as
    return <Simple className={className}>{children}</Simple>
  }

  return (
    <Etiqueta
      className={className}
      initial={{ opacity: 0, y: distancia }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: duracion,
        delay: indice * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Etiqueta>
  )
}
