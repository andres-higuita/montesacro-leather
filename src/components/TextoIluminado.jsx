import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

/**
 * Texto que se enciende palabra por palabra a medida que se baja.
 *
 * No es una animación de entrada: es una lectura guiada. La frase empieza
 * apagada al tono del lienzo y se va llenando de grafía conforme el bloque
 * cruza la pantalla. El ritmo lo pone el lector, no un temporizador.
 *
 * Se reserva para el manifiesto. Si se usara en cada párrafo dejaría de
 * significar algo, que es justo lo que el sistema evita.
 *
 * Con `prefers-reduced-motion` el texto nace encendido y no se liga al scroll.
 */

function Palabra({ palabra, indice, total, progreso }) {
  // Cada palabra ocupa un tramo del recorrido y se enciende dentro de él. El
  // solape (el tramo dura el doble del paso) evita el efecto de letrero LED.
  const paso = 1 / total
  const entrada = indice * paso
  const salida = entrada + paso * 2

  const opacidad = useTransform(progreso, [entrada, salida], [0.22, 1])

  return (
    <motion.span style={{ opacity: opacidad }} className="inline">
      {palabra}{indice < total - 1 ? ' ' : ''}
    </motion.span>
  )
}

export default function TextoIluminado({ children, className = '', as = 'p' }) {
  const referencia = useRef(null)
  const reducido = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: referencia,
    // Empieza cuando el bloque entra por abajo y termina cuando su parte alta
    // llega al centro: la frase queda encendida entera mientras aún se lee.
    offset: ['start 0.85', 'start 0.35'],
  })

  const Etiqueta = as

  if (reducido) {
    return <Etiqueta className={className}>{children}</Etiqueta>
  }

  const palabras = String(children).split(/\s+/).filter(Boolean)

  return (
    <Etiqueta ref={referencia} className={className}>
      {palabras.map((palabra, i) => (
        <Palabra
          key={`${palabra}-${i}`}
          palabra={palabra}
          indice={i}
          total={palabras.length}
          progreso={scrollYProgress}
        />
      ))}
    </Etiqueta>
  )
}
