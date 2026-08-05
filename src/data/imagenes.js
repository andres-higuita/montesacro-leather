/**
 * Único punto de verdad de la imaginería del prototipo.
 *
 * Las fotos del bolso son las tomas de estudio reales, en `/fotos/bolso/`. Las
 * de contexto —empaque, taller, herraje— siguen siendo marcadores de posición
 * de Unsplash con ID verificado. Para pasar a fotografía real: reemplazar `id`
 * por la ruta local (`/fotos/loquesea.jpg`) y reescribir el `alt`.
 * Ningún otro archivo del proyecto referencia una URL de imagen.
 */

const RAIZ = 'https://images.unsplash.com/'

/** Un id que no empieza por `photo-` se trata como ruta local ya servida. */
const esLocal = (id) => !id.startsWith('photo-')

/** Construye la URL con los parámetros de recorte y calidad del sitio. */
export function foto(id, ancho = 1400, alto) {
  if (esLocal(id)) return id
  const recorte = alto ? `&h=${alto}` : ''
  return `${RAIZ}${id}?auto=format&fit=crop&w=${ancho}${recorte}&q=82`
}

/** Fuente de un <img> responsivo: srcset en tres anchos + sizes. */
export function juegoDeFotos(id, anchos = [640, 1024, 1600]) {
  if (esLocal(id)) return { src: id, srcSet: undefined }
  return {
    src: foto(id, anchos[1]),
    srcSet: anchos.map((a) => `${foto(id, a)} ${a}w`).join(', '),
  }
}

/* Aquí vivían `SECUENCIA_APERTURA`, `RESPALDO_APERTURA` y `SECUENCIA_VERTICAL`:
   los fotogramas de la portada de inicio cuando esa portada era un scrub. Se
   fueron con `AperturaScroll`, el componente que los dibujaba, el día que la
   portada pasó a ser un vídeo (`PortadaVideo`). Con ellos se borraron las 299
   imágenes de `public/secuencia/` y `public/secuencia-vertical/`, 25 MB que ya
   no pedía nadie. */

/**
 * Portada en vertical.
 *
 * El metraje de la portada es 16:9 y en la pantalla de un móvil no hay encaje
 * bueno: a `contain` la pieza queda diminuta entre dos franjas y a `cover` se
 * recorta el asa. Esta toma es la MISMA pieza fotografiada en vertical, así que
 * llena la pantalla sin perder nada. La usa `PortadaVideo` en lugar del vídeo
 * cuando la pantalla es vertical.
 */
export const RESPALDO_VERTICAL = {
  id: '/fotos/bolso-vertical.jpg',
  alt: 'Bolso de mano en caimán negro, solapa cerrada y barra dorada mate, sobre fondo negro',
}

/** Detalle de material para las columnas en parallax de la portada. */
export const COLUMNAS_MATERIAL = [
  {
    imagen: {
      id: 'photo-1716540103530-cc33cdd20cde',
      alt: 'Caja rígida oscura con emblema dorado estampado en la tapa',
      pie: 'Caja rígida',
    },
    ratio: '3 / 4',
    velocidad: 44,
    desfase: 0,
  },
  {
    imagen: {
      id: 'photo-1517333082158-9a76448d0ea3',
      alt: 'Bolsa de compra de papel texturizado en tono oscuro, sostenida a mano',
      pie: 'Bolsa de compra',
    },
    ratio: '4 / 5',
    velocidad: 92,
    desfase: '14%',
  },
  {
    imagen: {
      id: 'photo-1759563871375-d5b140f6646e',
      alt: 'Estuche claro atado con cinta y sello, con tarjeta impresa al frente',
      pie: 'Tarjeta de autenticidad',
    },
    ratio: '3 / 4',
    velocidad: 26,
    desfase: '5%',
  },
]

export const IMG = {
  // --- Portada -------------------------------------------------------------
  portada: {
    id: 'photo-1521748484217-0d9c5f3728d1',
    alt: 'Bolso en piel de caimán negra, escamas marcadas, luz lateral de estudio sobre fondo oscuro',
  },
  texturaPiel: {
    id: 'photo-1731272832794-d66014ad7d87',
    alt: 'Macro de grano de piel curtida, relieve visible bajo luz rasante',
  },

  // --- Herraje y personalización -------------------------------------------
  cierre: {
    id: 'photo-1608831658269-9e15d8a7ddfa',
    alt: 'Cierre metálico recorriendo una pieza de piel negra, dientes en tono dorado',
  },
  herraje: {
    id: 'photo-1612889845286-723dc4572b62',
    alt: 'Herraje en dorado antiguo cepillado montado sobre piel negra',
  },
  placa: {
    id: 'photo-1558684936-143e7b37efaf',
    alt: 'Placa metálica dorada colgando de una anilla, acabado mate',
  },

  // --- Atelier --------------------------------------------------------------
  corte: {
    id: 'photo-1673543412596-2ff63b3b7c84',
    alt: 'Manos cortando material a mano sobre mesa de trabajo del taller',
  },
  taller: {
    id: 'photo-1539019490370-155ea559d513',
    alt: 'Artesano con tijera de guarnicionero en el banco de trabajo',
  },

  // --- Sistema de empaque ---------------------------------------------------
  bolsaCompra: {
    id: 'photo-1517333082158-9a76448d0ea3',
    alt: 'Bolsa de compra de papel texturizado en tono oscuro, sostenida a mano',
  },
  cajaRigida: {
    id: 'photo-1716540103530-cc33cdd20cde',
    alt: 'Caja rígida oscura con emblema dorado estampado en la tapa',
  },
  bolsaAlgodon: {
    id: 'photo-1709303014108-5d988f63864f',
    alt: 'Bolsa de algodón natural cerrada con cordón, apoyada sobre superficie clara',
  },
  tarjetaAutenticidad: {
    id: 'photo-1759563871375-d5b140f6646e',
    alt: 'Estuche claro atado con cinta y sello, con tarjeta impresa al frente',
  },
}

/**
 * Fotos por pieza y por colorway.
 * Clave externa: id de producto. Clave interna: id de colorway.
 * `galeria` son las tomas comunes a todas las pieles de esa pieza.
 */
export const IMG_PRODUCTO = {
  // FOTOGRAFÍA REAL. Las cuatro pieles son las tomas de estudio de la pieza,
  // el mismo material del que `scripts/bolso-real.sh` construye el recorrido
  // ligado al scroll. Aquí van las cerradas —el bloque de pieles compara
  // exteriores— y en la galería las abiertas, que es donde se ve el forro.
  'bolso-de-mano': {
    colorways: {
      negro: {
        id: '/fotos/bolso/negro-cerrado.jpg',
        alt: 'Bolso de mano en piel negra con relieve de caimán, solapa cerrada y correa de muñeca con la placa de iniciales',
      },
      'verde-botella': {
        id: '/fotos/bolso/verde-botella-cerrado.jpg',
        alt: 'Bolso de mano en piel verde botella con relieve de caimán, solapa cerrada y correa de muñeca',
      },
      marfil: {
        id: '/fotos/bolso/marfil-cerrado.jpg',
        alt: 'Bolso de mano en piel marfil con relieve de caimán, solapa cerrada y correa de muñeca',
      },
      vinotinto: {
        id: '/fotos/bolso/vinotinto-cerrado.jpg',
        alt: 'Bolso de mano en piel vinotinto con relieve de caimán, solapa cerrada y correa de muñeca',
      },
    },
    galeria: [
      {
        id: '/fotos/bolso/negro-abierto.jpg',
        alt: 'Bolso de mano negro abierto: forro de ante vinotinto, placa MONTESACRO cosida a la solapa y bolsillo con tirador de monograma MS',
      },
      {
        id: '/fotos/bolso/marfil-abierto.jpg',
        alt: 'Bolso de mano marfil abierto, con el mismo forro de ante vinotinto y el cierre imantado del cuerpo',
      },
    ],
  },

}
