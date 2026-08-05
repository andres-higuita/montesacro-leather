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

/**
 * La misma secuencia del recorrido, rodada en 9:16 para teléfono.
 *
 * No es un recorte de la horizontal: es el MISMO guion en vertical, de
 * `scripts/bolso-real.sh --video-vertical`. El plano 16:9 en una pantalla de
 * teléfono no tiene encaje bueno —a `cover` se pierden dos tercios del encuadre
 * y a `contain` queda una franja flotando en el negro—, así que la pieza que
 * tiene metraje propio en las dos formas pone las dos aquí.
 *
 * `RecorridoScrub` descarga UNA de las dos, la que corresponda a la forma de la
 * pantalla. Bajar ambas serían ocho megas tirados.
 */
const vertical = (id, total, ext = 'jpg') => ({
  total,
  ruta: (i) => `/piezas/${id}/scrub-v-${String(i + 1).padStart(4, '0')}.${ext}`,
})

/* Aquí vivía `BODEGON`, el plano de las tres piezas juntas que cerraba todas
   las fichas bajo el rótulo «Las otras dos piezas». Con una sola pieza en
   catálogo esa sección desapareció y el clip se fue con ella; sus archivos ya
   no están en `public/piezas/bodegon/`. */

export const ESCENAS = {
  'bolso-de-mano': {
    ...material('bolso-de-mano', 120),
    /* Procedencia: `~/Movies/para celular.mp4`, el mismo guion de pieles rodado
       en 9:16. 120 fotogramas con
       `FPS=12 CALIDAD=7 RECORTE='delogo=x=570:y=1129:w=60:h=62'
        ./scripts/bolso-real.sh --video-vertical`.
       Las marcas `en` de los capítulos NO cambian: medido fotograma a fotograma,
       las mudas de piel de la toma vertical caen en los mismos puntos que las de
       la horizontal, con menos de dos centésimas de diferencia. */
    secuenciaVertical: vertical('bolso-de-mano', 120),

    /* ÚNICA PIEZA CON MATERIAL PROPIO, repartido según lo que hace Apple en la
       ficha del MacBook Neo —comprobado en el DOM, no supuesto—:

       EL RECORRIDO (este bloque, ligado al scroll) ES LA PELÍCULA DE LAS CUATRO
       PIELES. Un plano continuo, cámara fija y pieza cerrada, en el que la piel
       va mudando de tono sin corte:

         marfil → negro → verde botella → vinotinto

       Va pegado al selector de `PanelPieles`: la película recorre las cuatro y
       las fichas de abajo dejan escoger. Es el orden del visor de producto de
       Apple —enseñar las variantes y acto seguido poder elegirlas.

       LA PIEZA NO SE ABRE EN ESTE PLANO. El metraje anterior remataba con la
       apertura y el forro de ante; este no, y por eso el capítulo [04] ya no la
       anuncia. Lo abierto se ve en la galería de `PanelPieles`
       (`/fotos/bolso/*-abierto.jpg`), que es donde vive ahora esa revelación.

       Procedencia: `~/Movies/videoVarianteBolso.mp4`, generado con Veo desde la
       fotografía de estudio. 120 fotogramas con
       `FPS=12 CALIDAD=7 RECORTE='delogo=x=1128:y=572:w=64:h=60'
        ./scripts/bolso-real.sh --video`. El `delogo` quita la marca de agua de
       la plataforma, medida en x 1136-1183 / y 580-623.

       Las marcas `en` de los capítulos salen de medir el color dominante del
       encuadre fotograma a fotograma sobre la secuencia ya generada, no del
       guion: marfil manda hasta 0.24, la muda a negro va de 0.24 a 0.31, el
       negro hasta 0.49 —ahí el verde le gana el canal—, y la muda a vinotinto
       ocurre entre 0.77 y 0.80. Las mismas marcas valen para la toma vertical:
       medidas por separado, no se apartan más de dos centésimas.

       El montaje de las ocho tomas de estudio (`bolso-real.sh` sin `--video`)
       sigue siendo el respaldo: son 105 fotogramas y las marcas serían otras.

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
       scroll→tiempo lineal, 466 px de scroll por segundo de vídeo). Con 120
       fotogramas, 2.1 pantallas dan 57 por pantalla. */
    recorrido: 2.1,
    /* Como PLACA y no a sangre. A sangre se veían dos costuras verticales: el
       fotograma es 16:9 y una pantalla ancha no lo es, así que el lienzo
       rellenaba los lados con el color muestreado de UNA esquina —un beige
       plano— contra el beige con viñeta del plató. La juntura se leía como dos
       líneas rectas a los extremos. Además el plano es 720p: llenar 1905 px CSS
       obligaba a ampliarlo tres veces y la escama se deshacía.
       1088 px es el ancho útil del `canal` en pantalla grande (78rem menos los
       dos 5rem de respiro), así que la placa alinea con el texto de los
       capítulos en vez de flotar a su aire. */
    anchoPlaca: 1088,
    /* Con placa el fotograma ya no se estira para llenar la pantalla, así que
       el techo puede subir del 1.25 de la casa: 2 permite el 1:1 en píxeles CSS
       sobre pantalla retina, que es lo que hace cualquier imagen normal. */
    nitidez: 2,
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
    /* El MISMO abanico rodado en 9:16, para teléfono. Con él la portada de la
       ficha vuelve a llenar la pantalla en móvil, con el texto encima, en vez de
       repartirse en columna alrededor de una franja 16:9.
       Procedencia: `~/Movies/abanicocelular.mp4`, con la estrella de marca de
       agua quitada y recodificado como el resto de los clips:
         ffmpeg -i abanicocelular.mp4 -vf "delogo=x=570:y=1129:w=60:h=62" \
           -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
           -movflags +faststart hero-vertical.mp4
       Solo se descarga uno de los dos clips: `PortadaPieza` elige la fuente al
       montar, así que el otro archivo ni se pide. */
    videoVertical: '/piezas/bolso-de-mano/hero-vertical.mp4',
    posterVertical: '/piezas/bolso-de-mano/portada-vertical.jpg',
    /* Respaldo por si el vídeo no arranca (Safari con ahorro de datos) o si hay
       movimiento reducido: el bodegón del que salió el clip, ya sin marca. */
    fotoPortada: {
      id: '/fotos/bolso/abanico-pieles.jpg',
      alt: 'Las cuatro pieles del bolso de mano —negro, verde botella, marfil y vinotinto— en abanico sobre fondo de estudio cálido',
    },
    alt: 'La misma pieza cerrada, en plano fijo, mudando de piel —marfil, negro, verde botella y vinotinto— sin corte entre una y otra',

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

    /* Un capítulo por piel, y cada uno entra cuando su tono ya manda en
       pantalla. Las marcas no están repartidas a ojo: salen de medir el color
       dominante del encuadre a lo largo del plano.
       El texto nombra la piel, como hace Apple en su visor —«Este es el modelo
       color plata»—, y añade el único dato que esa piel tiene de propio. */
    capitulos: [
      {
        en: 0.02,
        indice: '01',
        titulo: 'Marfil',
        texto:
          'La piel que menos perdona: sobre un tono claro, cualquier canto mal pulido o un punto torcido se ve a un metro. Se corta la última, cuando la mesa está limpia.',
      },
      {
        en: 0.30,
        indice: '02',
        titulo: 'Negro',
        texto:
          'El relieve deja de ser dibujo y pasa a ser luz: sobre negro no se lee el patrón, se lee cómo la escama devuelve el brillo al girar la pieza.',
      },
      {
        /* En el cruce medido, no después: el verde empieza a mandar sobre el
           negro en 0.49 en las dos tomas, y con 0.57 el rótulo llegaba con la
           pieza ya verde desde hacía media pantalla. */
        en: 0.52,
        indice: '03',
        titulo: 'Verde botella',
        texto:
          'Curtido al vegetal, sin capa que fije el tono. Es el color que más madura con los años: a los cinco no se parece al del catálogo, y esa es la idea.',
      },
      {
        en: 0.81,
        indice: '04',
        titulo: 'Vinotinto',
        texto:
          'El color de la casa, y el mismo del forro que llevan las cuatro: la única piel en la que el dentro y el fuera son el mismo tono.',
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

}

export function escenaDe(productoId) {
  return ESCENAS[productoId] ?? null
}
