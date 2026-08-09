/**
 * Las secuencias de fotogramas ligadas al scroll.
 *
 * Un recorrido NO es un vídeo reproduciéndose: es un índice de fotograma atado
 * a la posición del scroll, y por eso al subir va hacia atrás. Se dibuja en un
 * `<canvas>` y no en un `<video>` con `currentTime` porque buscar dentro de un
 * mp4 sesenta veces por segundo se atasca en Safari y en cualquier móvil: el
 * decodificador tiene que volver al fotograma clave anterior en cada salto. En
 * una secuencia de imágenes, cada posición ya está descodificada.
 *
 * Los fotogramas viven en `public/piezas/bolso-de-mano/`, numerados desde 1 con
 * cuatro dígitos. Para reponerlos desde un mp4 nuevo, ver VIDEOS-IA.md §6.
 */

const RAIZ = '/piezas/bolso-de-mano'

/** Numeración a cuatro dígitos: `scrub-0007.jpg`. */
const cuatro = (n) => String(n).padStart(4, '0')

/**
 * El recorrido maestro: la pieza gira de tres cuartos a frontal y la piel pasa
 * de marfil a vinotinto. 120 fotogramas, apaisado 1200 × 675.
 *
 * El cambio de piel a mitad del giro es la razón por la que este plano abre la
 * sección de las cuatro pieles: enseña el catálogo entero sin cortar el plano.
 */
export const VUELTA = {
  total: 120,
  ruta: (i) => `${RAIZ}/scrub-${cuatro(i + 1)}.jpg`,
}

/**
 * El mismo recorrido rodado en vertical. Manda en pantallas verticales, donde
 * un plano apaisado deja dos franjas muertas y obliga a encoger la pieza.
 */
export const VUELTA_VERTICAL = {
  total: 120,
  ruta: (i) => `${RAIZ}/scrub-v-${cuatro(i + 1)}.jpg`,
}

/**
 * Capítulos del recorrido.
 *
 * `en` es la posición dentro del recorrido, de 0 a 1. Cada capítulo manda desde
 * su marca hasta la del siguiente: nunca hay dos a la vez ni un hueco sin
 * ninguno. Las marcas están puestas contra lo que se ve en el fotograma, no
 * repartidas en tercios: el cambio de piel arranca hacia la mitad del plano.
 */
export const CAPITULOS_VUELTA = [
  {
    indice: '01',
    en: 0,
    titulo: 'El corte',
    texto:
      'La solapa se corta con el relieve corriendo en el sentido del cuerpo, para que el patrón siga siendo continuo cuando la pieza está cerrada.',
  },
  {
    indice: '02',
    en: 0.42,
    titulo: 'El canto',
    texto:
      'Cada borde se pinta y se pule a mano, capa por capa. Es la operación que más horas consume y la primera que delata una pieza mal hecha.',
  },
  {
    indice: '03',
    en: 0.74,
    titulo: 'La piel',
    texto:
      'Cuatro pieles curtidas al vegetal. La misma horma, el mismo herraje de níquel: lo único que cambia es el material.',
  },
]
