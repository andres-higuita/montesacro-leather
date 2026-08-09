/**
 * La secuencia de fotogramas del interior, ligada al scroll.
 *
 * Un recorrido NO es un vídeo reproduciéndose: es un índice de fotograma atado
 * a la posición del scroll, y por eso al subir va hacia atrás. Se dibuja en un
 * `<canvas>` y no en un `<video>` con `currentTime` porque buscar dentro de un
 * mp4 sesenta veces por segundo se atasca en Safari y en cualquier móvil: el
 * decodificador tiene que volver al fotograma clave anterior en cada salto. En
 * una secuencia de imágenes, cada posición ya está descodificada.
 *
 * PROCEDENCIA. Sale de un clip generado con IA a partir de las dos tomas de
 * estudio reales —`negro-cerrado.jpg` y `negro-abierto.jpg`—, y por eso el
 * interior es el de verdad: ante vinotinto, placa MONTESACRO cosida a la
 * solapa, tirador con el monograma MS y broche imantado. Cómo se generó y con
 * qué prompt está en VIDEOS-IA.md §7.
 *
 * Son los 240 fotogramas del clip, a su cadencia original de 24 fps y sin
 * diezmar. La cuenta que importa no son los fotogramas por segundo sino los
 * FOTOGRAMAS POR PANTALLA DE SCROLL, y ahí hay un compromiso: alargar el
 * recorrido hace el gesto más lento, pero reparte los mismos fotogramas entre
 * más scroll y, pasado cierto punto, se empieza a ver a saltos al arrastrar
 * hacia atrás. Por debajo de 45 por pantalla se nota.
 *
 * Con 240 fotogramas y un recorrido de 5 viewports quedan 48 por pantalla: es
 * el máximo que se puede estirar este clip sin que empiece a escalonar. Para ir
 * más lento hace falta más metraje, no más recorrido.
 */

/** Numeración a cuatro dígitos: `interior-0007.jpg`. */
const cuatro = (n) => String(n).padStart(4, '0')

export const INTERIOR = {
  total: 240,
  ruta: (i) => `/piezas/interior/interior-${cuatro(i + 1)}.jpg`,
}

/**
 * Capítulos del recorrido.
 *
 * `en` es la posición dentro del recorrido, de 0 a 1. Cada capítulo manda desde
 * su marca hasta la del siguiente. Las marcas están puestas contra lo que se ve
 * en el fotograma —no repartidas en tercios—: la cámara llega al cierre hacia
 * la mitad del plano y no entra del todo hasta el último cuarto.
 */
export const CAPITULOS_INTERIOR = [
  {
    indice: '01',
    en: 0,
    titulo: 'La solapa',
    texto:
      'Se pliega hacia atrás sobre el canto superior. El relieve corre en el sentido del cuerpo, así que el patrón sigue siendo continuo con la pieza cerrada.',
  },
  {
    indice: '02',
    en: 0.45,
    titulo: 'El cierre',
    texto:
      'Cremallera de alta resistencia YKK Excella®. El tirador va fundido en zamak macizo con el monograma MS integrado, en níquel pulido.',
  },
  {
    indice: '03',
    en: 0.78,
    titulo: 'El forro',
    texto:
      'Ante vinotinto, con la placa MONTESACRO cosida a la solapa. Fuera la pieza es seca; dentro cambia por completo de registro.',
  },
]
