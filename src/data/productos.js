/**
 * Catálogo MONTESACRO.
 *
 * Las cuatro vistas del sitio consumen este archivo. Un solo objeto describe
 * una pieza completa: colorways, ficha técnica, empaque y personalización.
 *
 * PROCEDENCIA DE LOS DATOS
 * - Herrajes, empaque, gramajes y medidas de caja/bolsa: tomados literalmente
 *   del collection book de la marca.
 * - Medidas de la pieza (`specs.medidas`): estimadas a partir de la medida
 *   exterior de su caja. PENDIENTE de confirmar con producción.
 * - `precioDesde`, `peso` y `codigo`: marcadores de posición del prototipo.
 *   El precio se deja literalmente como "Desde $XXX" a propósito: poner una
 *   cifra inventada en una marca de lujo induce a error en la revisión.
 */

/**
 * Fichas de piel.
 * `token` apunta a una variable de src/index.css.
 * `codigo` es el sufijo de tres letras del código de producto.
 */
export const COLORWAYS = {
  vinotinto: { id: 'vinotinto', nombre: 'Vinotinto', token: 'var(--color-cw-vino)', codigo: 'VNT' },
  negro: { id: 'negro', nombre: 'Negro', token: 'var(--color-cw-negro)', codigo: 'NGR' },
  'azul-marino': {
    id: 'azul-marino',
    nombre: 'Azul marino',
    token: 'var(--color-cw-azul)',
    codigo: 'AZM',
  },
  'verde-botella': {
    id: 'verde-botella',
    nombre: 'Verde botella',
    token: 'var(--color-cw-verde)',
    codigo: 'VRB',
  },
  'caiman-negro': {
    id: 'caiman-negro',
    nombre: 'Caimán negro',
    token: 'var(--color-cw-negro)',
    codigo: 'CAN',
  },
  marfil: {
    id: 'marfil',
    nombre: 'Marfil',
    token: 'var(--color-cw-marfil)',
    codigo: 'MRF',
  },
  'cafe-oscuro': {
    id: 'cafe-oscuro',
    nombre: 'Café oscuro',
    token: 'var(--color-cw-cafe)',
    codigo: 'CFO',
  },
}

/** Código completo de una pieza en una piel: MS-BM-CAN. */
export function codigoDeProducto(producto, colorwayId) {
  return `${producto.codigo}-${COLORWAYS[colorwayId]?.codigo ?? '···'}`
}

/** Cierre exclusivo. Idéntico en las tres piezas. Datos del collection book. */
export const CIERRE = {
  nombre: 'Cierre exclusivo con monograma MS',
  material: 'Zamak macizo',
  acabado: 'Dorado antiguo cepillado',
  sistema: 'Cierre de alta resistencia YKK Excella®',
  durabilidad: 'Resistente a la corrosión y al desgaste',
  medidas: '2.8 × 1.6 cm',
}

/** Placa de personalización. Datos del collection book. */
export const PLACA = {
  material: 'Cuero genuino',
  grabado: 'Bajo relieve o estampado en dorado',
  acabado: 'Bordes pintados y pulidos a mano',
  medidas: '5.0 × 2.0 cm aprox.',
  entrega: 'Se entrega dentro de una bolsita protectora de algodón',
}

/** Los cuatro elementos del empaque, de afuera hacia adentro. */
export const EMPAQUE = [
  {
    orden: 1,
    id: 'bolsa-de-compra',
    nombre: 'Bolsa de compra',
    imagen: 'bolsaCompra',
    entrada:
      'Dos tamaños. La pieza sale de la tienda envuelta en el mismo papel con el que se documenta.',
    specs: [
      ['Material', 'Papel texturizado premium 350 g/m²'],
      ['Color', 'Vino tinto imperial'],
      ['Acabado', 'Mate'],
      ['Estampado', 'Logo en hot stamping dorado'],
      ['Manijas', 'Cordón de algodón trenzado color vinotinto'],
      ['Bolsa S', '24 × 22 × 12 cm · tarjetero, portapasaporte, relojera'],
      ['Bolsa L', '32 × 30 × 18 cm · bolso de mano y neceser'],
    ],
  },
  {
    orden: 2,
    id: 'caja-rigida',
    nombre: 'Caja rígida',
    imagen: 'cajaRigida',
    entrada:
      'Cierre magnético con placa metálica dorada. Al abrirla aparece el papel de seda con el monograma en repetición.',
    specs: [
      ['Material', 'Cartón rígido de alta densidad 2.5 mm'],
      ['Forro exterior', 'Papel texturizado premium'],
      ['Color', 'Vino tinto imperial'],
      ['Acabado', 'Mate'],
      ['Estampado', 'Logo en hot stamping dorado'],
      ['Cierre', 'Magnético con placa metálica dorada'],
      ['Forro interior', 'Papel de seda color marfil con monograma en repetición'],
    ],
  },
  {
    orden: 3,
    id: 'bolsa-de-algodon',
    nombre: 'Bolsa de algodón',
    imagen: 'bolsaAlgodon',
    entrada:
      'Protege la piel dentro de la caja y sigue trabajando durante los treinta años siguientes, en el clóset.',
    specs: [
      ['Material', 'Algodón premium 320 g/m²'],
      ['Color', 'Beige natural'],
      ['Estampado', 'Logo en serigrafía color vinotinto'],
      ['Cierre', 'Cordón de algodón color vinotinto con nudos de seguridad'],
      ['Bolso de mano', '28 × 24 cm'],
      ['Neceser', '26 × 20 cm'],
      ['Tarjetero', '16 × 13 cm'],
    ],
  },
  {
    orden: 4,
    id: 'tarjeta-de-autenticidad',
    nombre: 'Tarjeta de autenticidad',
    imagen: 'tarjetaAutenticidad',
    entrada:
      'Impresa en letterpress sobre cartulina de algodón. Lleva un número de serie único, distinto en cada pieza fabricada.',
    specs: [
      ['Material', 'Cartulina de algodón premium 700 g/m²'],
      ['Color', 'Marfil'],
      ['Acabado', 'Textura fina'],
      ['Impresión', 'Letterpress (alto relieve) y hot stamping dorado'],
      ['Medidas', '8.5 × 5.5 cm'],
      ['Detalle', 'Número de serie único para cada pieza'],
    ],
  },
]

/* UNA SOLA PIEZA EN CATÁLOGO.
   El tarjetero y el neceser se retiraron a mano: la casa sale con el bolso y
   nada más. Sus fichas, sus escenas y su imaginería se fueron con ellos, y las
   secciones que enseñaban «las otras piezas» se callan solas cuando esta lista
   tiene un único elemento. Para volver a tres hay que reponer aquí las entradas,
   sus escenas en `escenas.js` y sus fotos en `imagenes.js`. */
export const PRODUCTOS = [
  {
    id: 'bolso-de-mano',
    slug: 'bolso-de-mano',
    codigo: 'MS-BM',
    precioDesde: 'Desde $XXX',
    peso: '620 g',
    nombre: 'Bolso de mano',
    familia: 'Piel con relieve de caimán',
    resumen: 'Solapa de relieve de caimán, forro de ante vinotinto, cuatro pieles.',
    /* PROCEDENCIA: reescrito contra la fotografía real de estudio de la pieza
       (public/fotos/bolso/). El texto anterior vendía un bolso cortado de un
       solo lomo de caimán y con forro de becerro marfil; la pieza fotografiada
       lleva relieve de caimán en patrón regular y forro de ante vinotinto, y
       existe en las cuatro pieles a la vez. Se dejó de afirmar lo que la
       imagen contradice. Si el material es caimán natural, aquí es donde se
       corrige —y también `specs.materiales` y el manifiesto de escenas.js. */
    esencia:
      'La pieza más reconocible de la casa. La solapa se corta con el relieve corriendo en el sentido del cuerpo, el canto se pinta y se pule a mano capa por capa, y por dentro el ante vinotinto cambia por completo el registro: fuera es una pieza seca, dentro es cálida. La correa de muñeca se desmonta y lleva la placa con las iniciales.',
    colorways: ['negro', 'verde-botella', 'marfil', 'vinotinto'],
    specs: {
      medidas: [
        ['Ancho', '25 cm'],
        ['Alto', '20 cm'],
        ['Profundidad', '6 cm'],
      ],
      materiales: [
        ['Exterior', 'Piel con relieve de caimán, curtida al vegetal'],
        ['Forro', 'Ante vinotinto, con placa MONTESACRO cosida'],
        ['Correa', 'Desmontable, con placa de iniciales'],
        ['Cantos', 'Pintados y pulidos a mano'],
      ],
      herrajes: [
        ['Cierre', CIERRE.nombre],
        ['Material', CIERRE.material],
        ['Acabado', CIERRE.acabado],
        ['Sistema', CIERRE.sistema],
      ],
    },
    empaque: ['Bolsa L · 32 × 30 × 18 cm', 'Caja rígida · 26.5 × 21.5 × 7.5 cm', 'Bolsa de algodón · 28 × 24 cm'],
  },

]

export function buscarProducto(clave) {
  return PRODUCTOS.find((p) => p.slug === clave || p.id === clave)
}
