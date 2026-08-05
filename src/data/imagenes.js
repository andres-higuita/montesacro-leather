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

/**
 * Secuencia de apertura ligada al scroll (portada).
 *
 * MARCADOR DE POSICIÓN. Mientras `total` sea 0, el componente dibuja el
 * tarjetero por código para que se pueda validar el ritmo del scroll.
 *
 * Para enchufar los fotogramas reales:
 *   1. Exportar la secuencia (render 3D o fotos en trípode) numerada desde 1:
 *      `apertura-0001.webp` … `apertura-0120.webp`.
 *   2. Ponerlos en `public/secuencia/`.
 *   3. Poner aquí `total` con el número de fotogramas.
 *
 * Requisitos del metraje: cámara fija, el objeto es lo único que se mueve,
 * fondo transparente o del color del lienzo, y el mismo encuadre en todos.
 */
export const SECUENCIA_APERTURA = {
  total: 150,
  ruta: (i) => `/secuencia/apertura-${String(i + 1).padStart(4, '0')}.jpg`,
  alt: 'Recorrido de cámara sobre las piezas en caimán —clutch negro, neceser marfil, tarjetero verde— apoyadas en un pedestal de mármol negro',
}

/**
 * Respaldo de la portada mientras no hay secuencia.
 *
 * Una sola fotografía REAL con un empuje de cámara lento ligado al scroll. No
 * gira —para eso hacen falta fotogramas— pero es material de verdad: grano,
 * escama y luz. Se prefiere a un dibujo vectorial, que a este tamaño se lee
 * como ilustración y no como producto.
 *
 * En cuanto `SECUENCIA_APERTURA.total` sea mayor que 0, esta imagen deja de
 * usarse sola y manda la secuencia.
 */
export const RESPALDO_APERTURA = {
  id: 'photo-1521748484217-0d9c5f3728d1',
  alt: 'Bolso de mano en piel de caimán, escamas de lomo marcadas, luz lateral dura sobre fondo oscuro',
}

/**
 * Portada en vertical.
 *
 * La secuencia es 16:9 y en la pantalla de un móvil no hay encaje bueno:
 * centrada deja la pieza diminuta entre dos franjas, y a `cover` recorta el
 * asa. Esta toma es la MISMA pieza fotografiada en vertical, así que llena la
 * pantalla sin perder nada.
 *
 * No se abre —es una sola imagen—, así que en móvil el scroll mueve un
 * acercamiento lento en vez de la apertura. Para que también se abra hace
 * falta una secuencia vertical, generada desde esta misma toma.
 */
export const RESPALDO_VERTICAL = {
  id: '/fotos/bolso-vertical.jpg',
  alt: 'Bolso de mano en caimán negro, solapa cerrada y barra dorada mate, sobre fondo negro',
}

/**
 * Secuencia de apertura en vertical (9:16), para móvil.
 *
 * Mientras `total` sea 0, en vertical se dibuja `RESPALDO_VERTICAL` con un
 * acercamiento lento: se ve bien pero no se abre.
 *
 * Para enchufarla:
 *   1. Generar el vídeo en 9:16 desde `/fotos/bolso-vertical.jpg`.
 *   2. ./scripts/secuencia.sh --vertical <archivo.mp4>
 *   3. Poner aquí el número de fotogramas que imprime el script.
 *
 * Solo se descarga una de las dos secuencias, la que corresponda a la forma de
 * la pantalla. Cargar las dos duplicaría 13 MB para nada.
 */
export const SECUENCIA_VERTICAL = {
  total: 149,
  ruta: (i) => `/secuencia-vertical/apertura-${String(i + 1).padStart(4, '0')}.jpg`,
  alt: 'Bolso de mano en caimán negro abriéndose, revelando el forro marfil y la placa dorada cosida al interior',
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

  tarjetero: {
    colorways: {
      // Vinotinto y verde botella salen del metraje (scripts/piezas.sh).
      vinotinto: {
        id: '/fotos/tarjetero-vinotinto.jpg',
        alt: 'Tarjetero en piel vinotinto abierto sobre mármol negro, con los alojamientos a la vista',
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
        id: '/fotos/tarjetero-verde-botella.jpg',
        alt: 'Tarjetero en piel verde botella abierto sobre mármol negro, con el monograma grabado en el interior',
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
      // Vinotinto y negro son fotogramas del metraje de la marca, extraídos por
      // scripts/piezas.sh: la MISMA pieza que se recorre en la ficha. Las dos
      // pieles que el metraje no cubre siguen con marcador de posición.
      vinotinto: {
        id: '/fotos/neceser-vinotinto.jpg',
        alt: 'Neceser en piel vinotinto sobre mármol negro, con el tirador de monograma cayendo sobre la piel',
      },
      negro: {
        id: '/fotos/neceser-negro.jpg',
        alt: 'Neceser en piel negra junto a su versión en marfil, sobre pedestal de mármol negro',
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
