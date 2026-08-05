/**
 * El guion cinematográfico de cada pieza.
 *
 * La ficha de producto no es una tabla con fotos: es un recorrido. Este archivo
 * es su guion — qué metraje se ve, en qué orden, y qué frase entra en cada
 * punto del scroll. `productos.js` sigue siendo la verdad de los DATOS (medidas,
 * materiales, códigos); aquí solo vive la puesta en escena.
 *
 * PROCEDENCIA DEL MATERIAL
 * Todo sale del mismo plano continuo de 10 s del que salió la portada. El
 * script `scripts/piezas.sh` lo corta en tramos —uno por pieza— y de cada tramo
 * deja el clip de portada, su póster y los fotogramas del recorrido. El clip de
 * portada es un plano DISTINTO del que abre el recorrido: con el mismo, la
 * ficha enseñaba dos veces la misma imagen y el recorrido perdía la revelación.
 * Si algún día hay metraje propio por pieza, basta con dejarlo en esas rutas y
 * corregir `secuencia.total`: ningún componente cambia.
 *
 * LOS CAPÍTULOS
 * `en` es la fracción del recorrido (0-1) donde el capítulo manda. Están
 * escritos contra lo que de verdad se ve en el metraje de esa pieza, no contra
 * un guion inventado: si el tramo del bolso pasa del negro al vinotinto en su
 * segundo tercio, ahí va el capítulo de las pieles.
 */

/**
 * Rutas del material que produce `scripts/piezas.sh`.
 *
 * `ext` es la extensión de los fotogramas del recorrido. Por defecto JPEG, que
 * es lo que sale de ffmpeg sin más. Las secuencias largas —cuatro clips
 * encadenados, uno por piel— se pasan a WebP con `scripts/bolso-vueltas.sh`,
 * que pesa la mitad; ese script imprime la extensión que hay que poner aquí.
 */
const material = (id, total, ext = 'jpg') => ({
  video: `/piezas/${id}/hero.mp4`,
  poster: `/piezas/${id}/poster.jpg`,
  secuencia: {
    total,
    ruta: (i) => `/piezas/${id}/scrub-${String(i + 1).padStart(4, '0')}.${ext}`,
  },
})

/** El bodegón final con las tres piezas. Cierra todas las fichas. */
export const BODEGON = {
  video: '/piezas/bodegon/hero.mp4',
  poster: '/piezas/bodegon/poster.jpg',
  alt: 'Las tres piezas juntas sobre mármol negro: bolso de mano en caimán negro, tarjetero verde botella y neceser marfil',
}

export const ESCENAS = {
  'bolso-de-mano': {
    ...material('bolso-de-mano', 105),

    /* ÚNICA PIEZA CON MATERIAL PROPIO, repartido según lo que hace Apple en la
       ficha del MacBook Neo —comprobado en el DOM, no supuesto—:

       EL RECORRIDO (este bloque, ligado al scroll) ES EL MONTAJE DE LAS OCHO
       TOMAS DE ESTUDIO, que `scripts/bolso-real.sh` encadena en un solo plano
       continuo de 105 fotogramas:

         cerrada en negro → las cuatro pieles → se abre → los cuatro interiores

       Aquí manda la pieza REAL en sus cuatro pieles, no metraje generado. Se
       probó poner el clip generado de la piel negra dando la vuelta mientras se
       abre, y se descartó: en el bloque de las variantes una animación de un
       solo color no pinta nada. El clip sigue en `~/Movies/bolsoNegro.mp4` y se
       enchufa con `FPS=12 CALIDAD=7 ./scripts/bolso-real.sh --video <archivo>`
       cuando existan las cuatro pieles y se puedan encadenar con
       `scripts/bolso-vueltas.sh` — ese script imprime el total de fotogramas y
       las cuatro marcas `en` ya calculadas.

       Las marcas `en` de abajo van contra ESTE montaje: la apertura cae entre
       0.40 y 0.56 del recorrido. Si se cambian las duraciones del script, hay
       que moverlas.

       LA PORTADA ES EL ABANICO GIRANDO. Las cuatro pieles a la vez, y el grupo
       gira sobre su eje hasta invertir el orden. Como clip de entrada —se
       reproduce una vez y se queda quieto— funciona; atado al scroll no, porque
       entre los segundos 2.9 y 4.9 las piezas se apiñan y el generador dibuja
       siluetas de más, y en un scrub eso se puede parar y mirar.
         Origen: `~/Movies/video abanico.mp4`, generado desde el bodegón de las
       cuatro tomas cerradas que está en /fotos/bolso/abanico-pieles.jpg.

       LAS CUATRO PIELES NO SON VÍDEO, y esto también es de Apple: en su visor
       de producto los colores son cuatro FOTOS FIJAS (`pv_colors_silver`,
       `pv_colors_blush`, `pv_colors_citrus`, `pv_colors_indigo`) que se relevan
       con un fundido al pulsar las fichas, mientras el metraje de las funciones
       existe una sola vez y en un solo color. Aquí eso es `PanelPieles` con las
       cuatro tomas de `/fotos/bolso/`: no hay que generar una apertura por piel.

       El clip generado de la piel negra queda fuera del recorrido por lo dicho
       arriba. */
    /* Cuántas pantallas de scroll dura el recorrido. A mano y no por la fórmula
       general: la referencia medida sobre la sección de rendimiento de Apple es
       de 82 fotogramas por pantalla (468 fotogramas en 5.7 pantallas, mapeo
       scroll→tiempo lineal, 466 px de scroll por segundo de vídeo). Con 105
       fotogramas, 2.6 pantallas dan 40 por pantalla: la mitad de densidad que
       Apple, y basta porque aquí no se mueve ningún herraje, solo cambia el
       tono. */
    recorrido: 2.6,
    /* A sangre, y con el techo de ampliación subido. Los fotogramas se entregan
       a 1200 px de ancho: en una pantalla retina de 1905 px CSS —3810 reales—
       llenarla obliga a ampliar, y con el 1.25 de la casa el fotograma se
       quedaba pequeño y con marco. Con 3 se dibuja lleno. */
    nitidez: 3,
    /* A velocidad normal. El 0.6× por defecto está pensado para los clips del
       metraje maestro, que duran menos de un segundo; el abanico dura 10 s y
       ralentizado se quedaría en más de quince segundos de portada. */
    velocidad: 1,
    /* Sin empuje de cámara por CSS: el abanico ya tiene movimiento propio. Con
       los dos, las piezas de las puntas se salían del encuadre. */
    empuje: false,
    /* Velos fuertes, los de la casa. Se probaron los suaves y con el abanico no
       valen: la pieza marfil cae justo detrás de la divisa y el texto en marfil
       desaparece sobre ella. Con una sola pieza negra sí funcionaban —queda
       apuntado por si el reparto de planos vuelve a cambiar. */
    /* Póster del clip de portada. Se sobrescribe el de `material()` porque ese
       nombre (`poster.jpg`) lo pisaría el modo `--video` del script al regenerar
       el recorrido, y son dos planos distintos. */
    poster: '/piezas/bolso-de-mano/portada.jpg',
    /* Respaldo por si el vídeo no arranca (Safari con ahorro de datos) o si hay
       movimiento reducido: el bodegón del que salió el clip, ya sin marca. */
    fotoPortada: {
      id: '/fotos/bolso/abanico-pieles.jpg',
      alt: 'Las cuatro pieles del bolso de mano —negro, verde botella, marfil y vinotinto— en abanico sobre fondo de estudio cálido',
    },
    alt: 'La pieza en las cuatro pieles —negro, verde botella, marfil y vinotinto—, cerrada y después abierta mostrando el forro de ante vinotinto con la placa MONTESACRO',

    /* La divisa: una línea, sin verbo de catálogo. Va bajo el nombre en la
       portada de la ficha, donde Apple pone su tagline. */
    divisa: 'Por fuera, seca. Por dentro, vinotinto.',

    /* Titular del bloque de pieles. Se sobrescribe el de la casa porque aquí las
       cuatro son la misma pieza en cuatro tonos, no cuatro patrones únicos. */
    pieles: {
      titulo: 'Cuatro pieles. El mismo forro.',
      texto:
        'Negro, verde botella, marfil y vinotinto: misma horma, mismo herraje en níquel, mismo ante vinotinto dentro. Lo único que se elige aquí es con qué tono se sale a la calle.',
    },

    /* El manifiesto se enciende palabra por palabra. Es la única frase larga
       de la ficha y por eso puede permitirse el tamaño de portada. */
    manifiesto:
      'Una pieza así se juzga dos veces: cerrada, por el relieve y el canto; abierta, por lo que aparece dentro. La segunda es la que decide.',

    /* Cuatro capítulos y no tres: el recorrido tiene dos actos —las pieles y el
       interior— y con tres, uno de ellos manda durante media pantalla larga sin
       nada nuevo que decir. Las marcas van contra el montaje de las ocho tomas:
       negro cerrado hasta 0.17, las pieles del 0.17 al 0.40, la apertura del
       0.40 al 0.56, y los cuatro interiores del 0.56 al final. */
    capitulos: [
      {
        en: 0.03,
        indice: '01',
        titulo: 'El relieve, en el sentido del cuerpo',
        texto:
          'La solapa se corta con el patrón corriendo a lo largo, de modo que el relieve no se quiebra en el pliegue. Es la primera cosa que se mira y la que peor perdona un corte apurado.',
      },
      {
        en: 0.19,
        indice: '02',
        titulo: 'Cuatro pieles, un solo molde',
        texto:
          'Negro, verde botella, marfil y vinotinto. Misma horma, mismo herraje: cambia el color y nada más, porque lo que se decide aquí es el tono, no la pieza.',
      },
      {
        en: 0.57,
        indice: '03',
        titulo: 'Dentro, ante vinotinto',
        texto:
          'El forro es ante en vinotinto en las cuatro pieles. Contra el marfil o contra el negro da lo mismo: al abrir, la pieza pasa de seca a cálida de golpe.',
      },
      {
        en: 0.82,
        indice: '04',
        titulo: 'Cierre imantado, tirador MS',
        texto:
          'El imán sujeta la solapa sin herraje a la vista por fuera, y el bolsillo con cierre lleva el monograma MS como tirador. La marca no aparece hasta que la pieza está abierta.',
      },
    ],

    destellos: [
      {
        titulo: 'Correa de muñeca',
        texto: 'Se desmonta del mosquetón. La pieza pasa de clutch a bolso de mano sin herraje de más.',
      },
      {
        titulo: 'Placa de iniciales',
        texto: 'Cuelga de la correa, grabada en bajo relieve. Es el único sitio donde la pieza lleva algo que no es de la casa.',
      },
      {
        titulo: 'Cantos pintados',
        texto: 'Capa, lija, capa, hasta que la piel y el borde son una sola superficie continua.',
      },
    ],
  },

  neceser: {
    ...material('neceser', 39),
    alt: 'Neceser en piel exótica marfil sobre mármol negro, acompañado por las versiones en negro y vinotinto',

    divisa: 'Viaja lleno. Vuelve lleno.',

    manifiesto:
      'Un neceser se juzga cuando está abierto sobre el mármol de un hotel, a las seis de la mañana, con todo dentro y nada cayéndose.',

    capitulos: [
      {
        en: 0.08,
        indice: '01',
        titulo: 'Base estructurada',
        texto:
          'Un refuerzo interno mantiene la pieza en pie y abierta. Sin él, el neceser se derrumba sobre sí mismo en cuanto se suelta.',
      },
      {
        en: 0.4,
        indice: '02',
        titulo: 'El cierre, de canto a canto',
        texto:
          'Recorre el borde superior completo: la pieza se abre del todo y se ve el fondo sin meter la mano a ciegas.',
      },
      {
        en: 0.75,
        indice: '03',
        titulo: 'Forro sellado',
        texto:
          'Tejido técnico resistente al agua. Un frasco que se abre en la maleta se limpia con un paño y no arruina la piel.',
      },
    ],

    destellos: [
      {
        titulo: 'Tirador de monograma',
        texto: 'El MS cae sobre la piel y hace de peso: el cierre no se queda a medio camino.',
      },
      {
        titulo: 'Asa lateral',
        texto: 'Cosida al canto, para sacarlo de la maleta de un tirón sin agarrarlo del cierre.',
      },
      {
        titulo: 'Cantos pulidos',
        texto: 'Mismo acabado a mano que el bolso. Es donde primero se nota una pieza barata.',
      },
    ],
  },

  tarjetero: {
    ...material('tarjetero', 22),
    alt: 'Tarjetero en piel exótica abierto mostrando los alojamientos, en verde botella y en marfil',

    divisa: 'La pieza que se toca todos los días.',

    manifiesto:
      'Un tarjetero se abre y se cierra veinte veces al día. A los diez años, o abre bien o delata todo lo que se hizo mal al fabricarlo.',

    /* Las marcas siguen al metraje: cerrado hasta el 27%, abierto en verde
       hasta el 53%, abierto en marfil hasta el final. */
    capitulos: [
      {
        en: 0.04,
        indice: '01',
        titulo: 'Dos milímetros de canto',
        texto:
          'Cerrado, todo el grosor de la pieza cabe en la uña. A esa escala no hay dónde esconder un relleno que abulte.',
      },
      {
        en: 0.26,
        indice: '02',
        titulo: 'Seis alojamientos',
        texto:
          'Rebajados a mano uno por uno, para que el grosor total no crezca con el uso ni se abra la boca de las ranuras.',
      },
      {
        en: 0.57,
        indice: '03',
        titulo: 'Seis décimas de milímetro',
        texto:
          'La piel se rebaja hasta 0.6 mm en la zona del pliegue. Es la diferencia entre un tarjetero que sigue cerrando plano y uno que no.',
      },
    ],

    destellos: [
      {
        titulo: 'Bolsillo central',
        texto: 'Para billetes doblados, entre las dos caras de tarjetas. Ningún compartimento que suene bien y no se use.',
      },
      {
        titulo: 'Forro de cabra',
        texto: 'Más fino que el becerro y más resistente al roce continuo de la tarjeta.',
      },
      {
        titulo: 'Placa interior',
        texto: 'La segunda aparición de la marca. Va dentro, y solo la ve quien lo abre.',
      },
    ],
  },
}

export function escenaDe(productoId) {
  return ESCENAS[productoId] ?? null
}
