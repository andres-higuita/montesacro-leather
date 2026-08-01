/**
 * Único punto de verdad de la imaginería del prototipo.
 *
 * Todas las fotos son marcadores de posición de Unsplash con ID verificado.
 * Para pasar a fotografía real de MONTESACRO: reemplazar `src` por la ruta
 * local (por ejemplo '/fotos/bolso-caiman-negro.jpg') y reescribir el `alt`.
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
  'bolso-de-mano': {
    colorways: {
      'caiman-negro': {
        id: 'photo-1521748484217-0d9c5f3728d1',
        alt: 'Bolso de mano en caimán negro, escamas de lomo centradas, luz lateral',
      },
      'cafe-oscuro': {
        id: 'photo-1575295912464-fcfd1186d11d',
        alt: 'Bolso de mano en caimán café oscuro sobre fondo neutro',
      },
      'azul-marino': {
        id: 'photo-1560891958-68bb1fe7fb78',
        alt: 'Bolso de mano en piel azul marino sostenido a la altura de la cadera',
      },
      'verde-botella': {
        id: 'photo-1768158989034-16744a486835',
        alt: 'Bolso de mano en piel verde botella colgado de un gancho de pared',
      },
    },
    galeria: [
      {
        id: 'photo-1575296237390-cc262fe81f4d',
        alt: 'Detalle del asa y el anclaje dorado del bolso de mano',
      },
      {
        id: 'photo-1705873655559-5109ba412a99',
        alt: 'Macro del broche metálico sobre la piel del bolso',
      },
    ],
  },

  tarjetero: {
    colorways: {
      vinotinto: {
        id: 'photo-1620109176813-e91290f6c795',
        alt: 'Tarjetero en piel vinotinto apoyado sobre una superficie de piel negra',
      },
      negro: {
        id: 'photo-1601592996763-f05c9c80a7f1',
        alt: 'Tarjetero en piel negra abierto sobre fondo claro',
      },
      'azul-marino': {
        id: 'photo-1512414947060-048d53abb081',
        alt: 'Tarjetero cerrado en piel azul marino sobre concreto',
      },
      'verde-botella': {
        id: 'photo-1772651983030-565c2b7be181',
        alt: 'Dos tarjeteros en piel verde botella sobre madera',
      },
    },
    galeria: [
      {
        id: 'photo-1629958513881-a086d21383cd',
        alt: 'Tarjetero visto de canto, bordes pintados y pulidos a mano',
      },
      {
        id: 'photo-1731272832794-d66014ad7d87',
        alt: 'Macro del grano de la piel del tarjetero',
      },
    ],
  },

  neceser: {
    colorways: {
      vinotinto: {
        id: 'photo-1644258559678-2eac1b8b79b6',
        alt: 'Neceser en piel vinotinto abierto con útiles de afeitado dentro',
      },
      negro: {
        id: 'photo-1546450658-04cd1b7dfddf',
        alt: 'Neceser en piel negra sostenido a una mano',
      },
      'azul-marino': {
        id: 'photo-1678869519879-1fcf45f369af',
        alt: 'Neceser en piel azul marino cerrado sobre una mesa',
      },
      'verde-botella': {
        id: 'photo-1618274199893-032d7339e2f1',
        alt: 'Neceser en piel verde botella sobre fondo claro',
      },
    },
    galeria: [
      {
        id: 'photo-1608831658269-9e15d8a7ddfa',
        alt: 'Detalle del cierre recorriendo el canto superior del neceser',
      },
      {
        id: 'photo-1565015583151-cf9884dc077c',
        alt: 'Macro del forro y la costura interior del neceser',
      },
    ],
  },
}
