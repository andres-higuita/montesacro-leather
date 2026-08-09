/**
 * El shader de la atmósfera: luz rozando una piel de caimán.
 *
 * No dibuja un fondo. Dibuja LA LUZ que cae sobre el negro que ya tiene la
 * página, y se compone en modo aditivo (ver `Atmosfera.jsx`). Por eso aquí no
 * aparece por ningún lado el color del lienzo: donde no hay luz, el resultado
 * es cero y lo que se ve es el negro del sitio. Así el efecto nunca deja un
 * rectángulo de un negro ligeramente distinto sobre otro.
 *
 * Todo el vocabulario es el de la casa: el oro es el herraje, el vino es la
 * banda de identidad. Los dos entran como uniforms leídos del tema con
 * `lib/color.js`, no como constantes: si mañana cambia `--color-acento`,
 * cambia esto también.
 */

/* Un triángulo que se sale de la pantalla por dos lados, no dos triángulos que
   forman un cuadrado. Cubre lo mismo con tres vértices en vez de seis y sin la
   diagonal por el medio, donde las GPU pierden un ciclo rasterizando dos veces
   los píxeles del borde compartido. */
export const VERTICES = new Float32Array([-1, -1, 3, -1, -1, 3])

export const VERTICE = /* glsl */ `
attribute vec2 a_vertice;

void main() {
  gl_Position = vec4(a_vertice, 0.0, 1.0);
}
`

export const FRAGMENTO = /* glsl */ `
/* 'highp' donde exista. El fbm encadena cuatro octavas de ruido y en mediump
   —diez bits de mantisa en muchos móviles— el resultado se escalona en bandas
   visibles justo en los tonos oscuros, que es donde vive todo este efecto. */
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  u_res;
uniform float u_tiempo;
/* Cursor en 0-1 sobre el lienzo, ya suavizado en JS. Llega a (0.5, 0.5)
   mientras nadie haya movido el ratón: en táctil no hay cursor y el efecto
   tiene que verse igual de vivo. */
uniform vec2  u_cursor;
/* Avance del scroll dentro de la sección, 0 al entrar y 1 al salir. */
uniform float u_avance;
/* Atenuación general. Es el mando de volumen del efecto. */
uniform float u_fuerza;
uniform vec3  u_oro;
uniform vec3  u_vino;

// ── Ruido ──────────────────────────────────────────────────────────────────

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Suavizado de Hermite: sin él las celdas del ruido se ven como un enrejado.
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  // Cuatro octavas. Con tres se nota el ruido base; con cinco el móvil de gama
  // media baja de 60 fps y la quinta octava ya no se distingue a este brillo.
  for (int i = 0; i < 4; i++) {
    v += a * ruido(p);
    // 2.03 y no 2.0: con el doble exacto las octavas alinean sus rejillas y
    // aparece un patrón cuadriculado. El desplazamiento rompe la simetría.
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

// ── La escama ──────────────────────────────────────────────────────────────

/**
 * ALTURA de la escama en un punto: 1 en el lomo, 0 en la junta.
 *
 * Es un campo de alturas, no una máscara. La diferencia importa: de una
 * máscara solo se puede sacar una mancha plana —que es como se ve el bordado
 * de lentejuelas—, mientras que de un campo de alturas se saca la NORMAL, y
 * con la normal la escama tiene lomo, ladera y canto. El brillo entonces
 * recorre el borde que mira a la luz en vez de rellenar la escama entera.
 *
 * Deja en 'celda' la coordenada entera, para que cada escama pueda tener su
 * propio brillo y la piel no se lea como un estampado.
 */
float escama(vec2 p, out vec2 celda) {
  // La escama del caimán es más alta que ancha.
  p.y *= 1.15;

  /* Filas trabadas —media escama de desfase por fila— para que las juntas no
     formen columnas rectas de arriba abajo. Pero SOLO media escama exacta
     produce un aparejo de ladrillo perfecto, y a tamaño pequeño un aparejo
     perfecto se lee como plástico de burbujas. El segundo término desplaza
     cada fila una cantidad distinta y rompe la cuadrícula. */
  float fila = floor(p.y);
  p.x += 0.5 * fila + hash(vec2(fila, 7.3)) * 0.45;

  celda = floor(p);
  vec2 f = fract(p) - 0.5;

  /* Ninguna escama está centrada en su casilla ni mide lo que su vecina. Es la
     diferencia entre una piel y una trama: en el animal las escamas se empujan
     unas a otras, así que unas se montan y entre otras se abre la junta. */
  f -= (vec2(hash(celda), hash(celda + 3.7)) - 0.5) * 0.28;
  f /= 0.80 + hash(celda + 11.3) * 0.42;

  /* Superelipse. Exponente más alto en x (3.4) que en y (2.4): la escama del
     lomo es un rectángulo de esquinas muy redondeadas, no un círculo. Con los
     dos exponentes iguales salían pastillas. */
  float d = pow(abs(f.x * 2.0), 3.4) + pow(abs(f.y * 2.0), 2.4);

  /* Cúpula, no meseta. Con 'smoothstep(0.5, 1.0, d)' el centro de la escama es
     una zona plana de valor 1 y la normal ahí sale perfectamente vertical: la
     escama se veía como una pastilla. Empezando la caída en 0 no hay ni un
     punto llano y toda la superficie está inclinada hacia algún lado.

     El factor final baja unas escamas respecto a otras. Es lo último que hacía
     falta para que la luz no barra la superficie entera de golpe. */
  float dome = 1.0 - smoothstep(0.0, 1.0, clamp(d, 0.0, 1.0));
  return dome * (0.68 + hash(celda + 5.1) * 0.32);
}

void main() {
  /* Coordenada centrada y normalizada por el ALTO, no por el ancho: así la
     escama mide lo mismo en un móvil vertical que en un monitor ancho. Con
     'gl_FragCoord / u_res' a secas se estiraría con la ventana. */
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_tiempo;

  /* Deriva del campo: el patrón se desplaza sobre sí mismo deformándose. Es lo
     único que impide que se lea como una textura repetida y quieta. Las dos
     componentes van a velocidades distintas y desfasadas —0.020 y 0.017, con
     un salto de 4.7— para que no describan una diagonal. */
  vec2 deriva = vec2(
    fbm(p * 1.4 + t * 0.020),
    fbm(p * 1.4 - t * 0.017 + 4.7)
  );
  vec2 q = p + (deriva - 0.5) * 0.22;

  /* Densidad de la piel. 19 escamas por unidad de alto y no 7: a 7 las escamas
     medían dos centímetros en pantalla y el fondo se leía como un empedrado
     que competía con el titular. La escama de un caimán es pequeña, y aquí
     además tiene que pasar por TEXTURA —algo que se intuye— y no por motivo.

     El scroll la arrastra hacia arriba. Va sumado a la coordenada y no
     multiplicado: el tamaño de la escama no debe cambiar al bajar, solo su
     posición. */
  vec2 sp = q * 19.0 + vec2(0.0, u_avance * 5.5);

  /* ── Relieve ─────────────────────────────────────────────────────────────
     La normal se saca por diferencias finitas: se mide la altura aquí y a un
     paso corto en cada eje. Se hace a mano y no con dFdx/dFdy porque esas
     necesitan una extensión de WebGL 1 que no está en todas partes, y porque
     el paso fijo da un relieve del mismo tamaño en cualquier densidad de
     pantalla —con las derivadas del hardware, el mismo shader sale con más
     relieve en un monitor normal que en uno retina. */
  const float PASO = 0.035;
  const float RELIEVE = 1.5;

  vec2 celda, otra;
  float h = escama(sp, celda);
  float hx = escama(sp + vec2(PASO, 0.0), otra);
  float hy = escama(sp + vec2(0.0, PASO), otra);
  vec3 normal = normalize(vec3((h - hx) * RELIEVE / PASO, (h - hy) * RELIEVE / PASO, 1.0));

  float propia = hash(celda);

  /* ── La luz ──────────────────────────────────────────────────────────────
     Un foco que ROZA la superficie, no que la ilumina de frente. Baja con el
     scroll y el cursor lo empuja: la mano del visitante inclina la pieza, no
     enciende una linterna. Por eso el desplazamiento por cursor (0.7 de ancho)
     es menor que el del scroll (1.1 de alto) — el gesto principal es bajar.

     La componente z de 0.42 es lo que hace que la luz RASE: cuanto más baja,
     más tumbado llega el rayo y más largo es el destello que recorre el canto.
     Con la luz de frente (z alta) las escamas se encienden todas a la vez y el
     relieve desaparece. */
  vec2 foco = vec2(
    -0.35 + u_cursor.x * 0.70,
     0.55 - u_avance * 1.10 - (u_cursor.y - 0.5) * 0.40
  );
  vec3 haz = normalize(vec3(foco - p, 0.42));
  // Caída exponencial y no lineal: una luz real no tiene borde.
  float roce = exp(-length(p - foco) * 1.25);

  /* Vector intermedio entre la luz y el ojo. Es el modelo de reflejo especular
     de toda la vida: donde la normal apunta justo al medio del camino entre
     los dos, la superficie devuelve el destello al observador. */
  vec3 medio = normalize(haz + vec3(0.0, 0.0, 1.0));
  float difuso = max(dot(normal, haz), 0.0);
  // Exponente 48: destello estrecho, de material encerado. Bajarlo lo convierte
  // en el brillo ancho y lechoso del plástico.
  float destello = pow(max(dot(normal, medio), 0.0), 48.0);

  // Grano de fondo: mantiene vivo el negro donde la luz ya no dibuja escama.
  float grano = fbm(q * 2.6 + t * 0.03);

  /* ── Composición, en aditivo ─────────────────────────────────────────────
     Los tres términos son deliberadamente flojos. Detrás de esto hay un
     titular que se lee palabra a palabra: la piel tiene que estar ahí cuando
     se la busca y desaparecer cuando se lee. Si al mirar la sección lo primero
     que se ve es el fondo, el fondo está mal.

     El vino sube con el avance: la sección empieza casi en negro puro y va
     tomando la banda de identidad según se baja. */
  vec3 luz = vec3(0.0);
  luz += u_vino * difuso * roce * 0.085 * (0.5 + u_avance * 0.6);
  luz += u_vino * grano * roce * 0.045;
  luz += u_oro * destello * roce * (0.16 + 0.20 * propia);

  /* Viñeta: el efecto tiene que MORIR en el negro de la página, no cortarse
     contra el borde del lienzo. El 0.72 en x lo aprieta de lado, que es donde
     el borde queda más cerca del contenido. */
  luz *= smoothstep(1.25, 0.25, length(p * vec2(0.72, 1.0)));
  luz *= u_fuerza;

  /* Tramado. Un degradado de esta oscuridad banda en cualquier panel de ocho
     bits por canal, y el bandeado sobre negro se ve como aros concéntricos.
     Medio nivel de ruido blanco lo rompe y a este brillo no se distingue. */
  luz = max(luz + (hash(gl_FragCoord.xy + t) - 0.5) / 255.0, 0.0);

  /* ── Salida en alfa premultiplicado ──────────────────────────────────────
     El lienzo se declara 'premultipliedAlpha: true' y NO usa mezcla de WebGL:
     quien compone es el navegador, con la fórmula 'origen + destino·(1-alfa)'.
     Con alfa = la componente más brillante, eso da exactamente una suma de luz
     sobre el negro de la página, y el rectángulo del lienzo no existe donde no
     hay efecto.

     El alfa TIENE que ser el máximo de las tres componentes y no su luminancia:
     el premultiplicado exige 'rgb <= alfa' canal a canal, y con luminancia el
     oro —que es casi todo rojo y verde— la incumpliría y saldría recortado. */
  gl_FragColor = vec4(luz, max(max(luz.r, luz.g), luz.b));
}
`
