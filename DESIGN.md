# Design

Sistema visual de MONTESACRO. Fuente de verdad de los tokens:
`src/index.css`. Este documento explica el porqué.

## Cómo está montado el color

El color se expresa en **dos capas**. Es lo único que hay que entender para
tocar cualquier parte del sistema.

1. **Paleta** — los colores de la marca, invariables: vino, arcilla, marfil,
   oro, tinta, humo. **Nunca se usan directamente en un componente.**
2. **Roles** — `lienzo`, `lienzo-alto`, `realce`, `grafia`, `grafia-suave`,
   `acento`. Es lo único que consumen los componentes. Un tema o un "mundo"
   reasigna los roles y toda la interfaz se reacomoda sin tocar una clase.

Por eso el mismo código produce la dirección clara y la oscura, y por eso
ningún componente recibe props de apariencia.

```jsx
// Bien: rol
<p className="text-grafia-suave">…</p>

// Mal: paleta
<p className="text-humo">…</p>
```

## Theme

**Dos direcciones sobre la misma maqueta**, alternables con un interruptor en
el encabezado. El interruptor es una **herramienta de revisión**, no una
preferencia de producto: cuando se decida una dirección se borra
`src/components/InterruptorTema.jsx`, `src/tema/`, su uso en `Encabezado` y el
script de `index.html`, y se deja la clase ganadora fija en `<html>`.

| Tema | Clase | Lienzo | Grafía | Acento |
|---|---|---|---|---|
| **Arcilla** (por defecto) | `.tema-arcilla` | `--color-arcilla` | `--color-tinta` | `--color-oro-hondo` |
| **Piel** | `.tema-piel` | `--color-piel` | `--color-marfil` | `--color-oro` |

La escena que originó la dirección oscura: un coleccionista de 50 años, en su
estudio, a las diez de la noche, con una lámpara cálida, comparando un bolso de
caimán que va a conservar treinta años. La dirección clara es la misma casa a
plena luz: arcilla es el vinotinto de la marca subido a luminosidad alta, mismo
matiz, saturación baja. No es un crema genérico.

### Los mundos

**Dos mundos materiales.** Sale del collection book, que alterna paneles
vinotinto oscuro con paneles de papel. La alternancia se conserva en los dos
temas: solo cambia cuál manda.

| Mundo | Clase | Qué hace |
|---|---|---|
| Base | `.mundo-base` | El lienzo del tema activo. |
| Contrario | `.mundo-contra` | Invierte el tema: claro dentro de oscuro, oscuro dentro de claro. Es el mundo de la **documentación** (specs, empaque, autenticidad). |
| Vino | `.mundo-vino` | Vinotinto imperial. Oscuro en los dos temas: es identidad, no tema. |
| Cuero | `.mundo-cuero` | Superficies que **son** piel (la placa grabada). Siempre oscuras: la piel de la pieza no cambia de color con la web. |

Regla: `mundo-contra` aparece siempre que el contenido sea *documental*. Nunca
por variedad visual.

Cada mundo existe en dos formas: `mundo-*` reasigna los roles **y pinta**;
`roles-*` solo reasigna. La segunda existe para el encabezado flotante.

### El encabezado y la banda que tiene debajo

El encabezado es `fixed` y en reposo no pinta fondo, así que hereda los roles
del tema y no los del contenido que tiene detrás. En una página cuya primera
banda es `mundo-vino` —oscura en los dos temas— eso deja grafía oscura sobre
vinotinto con el tema claro: el encabezado desaparece hasta que aparece su
fondo al hacer scroll.

Cada página declara su banda superior y el encabezado adopta esos roles
mientras está en reposo:

```jsx
useMundoDeCabecera('vino')   // src/tema/cabecera.js
```

Por el mismo motivo, la fotografía de la portada lleva un velo superior de
`lienzo` a transparente: el encabezado la cruza y sin ese degradado deja de
leerse en el tema claro.

## Color

Estrategia: **Committed.** El vinotinto de la marca carga entre 30% y 60% de la
superficie en las dos direcciones. El dorado nunca pasa del 5% y solo aparece
donde la pieza física lo tiene: cierre, placa, sello, filete.

Todo en OKLCH.

| Token | OKLCH | Rol |
|---|---|---|
| `--color-piel` | `oklch(0.17 0.026 22)` | Lienzo del tema piel. Casi negro con tinte vino. |
| `--color-piel-alta` | `oklch(0.22 0.032 22)` | Superficie elevada sobre piel. |
| `--color-vino` | `oklch(0.29 0.072 21)` | Vinotinto imperial. ≈ `#4A1B1F` del manual. |
| `--color-vino-hondo` | `oklch(0.235 0.06 21)` | Vino en sombra; bandas y pie. |
| `--color-arcilla` | `oklch(0.93 0.022 24)` | Lienzo del tema arcilla. El vinotinto a L 0.93. |
| `--color-arcilla-honda` | `oklch(0.875 0.026 24)` | Superficie elevada sobre arcilla. |
| `--color-arcilla-realce` | `oklch(0.885 0.03 24)` | Estado hover en tema claro. |
| `--color-marfil` | `oklch(0.935 0.018 84)` | Papel del empaque. Mundo contrario del tema piel. |
| `--color-marfil-hondo` | `oklch(0.885 0.022 82)` | Papel en sombra. |
| `--color-tinta` | `oklch(0.255 0.028 28)` | Grafía sobre claro. 12.9:1 en arcilla. |
| `--color-tinta-suave` | `oklch(0.44 0.024 28)` | Grafía secundaria sobre claro. 6.3:1. |
| `--color-humo` | `oklch(0.76 0.012 70)` | Grafía secundaria sobre oscuro. 8.9:1. |
| `--color-oro` | `oklch(0.68 0.082 82)` | Dorado antiguo cepillado, sobre oscuro. |
| `--color-oro-hondo` | `oklch(0.51 0.07 80)` | Dorado sobre claro. 4.7:1, apto para versalitas de 12px. |
| `--color-alerta-clara` | `oklch(0.70 0.13 32)` | Error de formulario sobre oscuro. 6.8:1. |
| `--color-alerta-honda` | `oklch(0.50 0.15 30)` | Error de formulario sobre claro. 5.2:1. |

La alerta es terracota y no un rojo de sistema: tiene que convivir con el
vinotinto de la marca sin pelearse con él. Son dos tonos porque uno solo no
alcanza AA sobre claro y sobre oscuro a la vez; el rol `--color-alerta` elige.

**Prohibido:** usar la paleta directamente en un componente; dorado como color
de texto de cuerpo; gradientes de cualquier tipo.

### Umbrales de opacidad

Verificados con conversión OKLCH → sRGB en los cuatro fondos del sistema. Sobre
texto:

- `text-grafia/70` y superior: **seguro en todos los mundos**.
- `text-grafia/60`: solo válido en `mundo-vino`.
- Por debajo de `/70`: solo ornamento `aria-hidden`.
- `text-grafia-suave` a opacidad reducida: **no**. Ya es el escalón atenuado.

### Colorways de producto

Cuatro pieles por pieza. Cada una es un token, usado en las fichas del
`SelectorColor`, en las cintas del catálogo y en el filete de estado activo.

| Colorway | Token | OKLCH |
|---|---|---|
| Vinotinto | `--color-cw-vino` | `oklch(0.30 0.085 20)` |
| Negro / Caimán negro | `--color-cw-negro` | `oklch(0.20 0.012 30)` |
| Azul marino | `--color-cw-azul` | `oklch(0.28 0.055 255)` |
| Verde botella | `--color-cw-verde` | `oklch(0.30 0.048 155)` |
| Café oscuro | `--color-cw-cafe` | `oklch(0.28 0.045 55)` |

El bolso de mano tiene su propia carta (caimán negro, café oscuro, azul marino,
verde botella) porque es la única pieza en piel de caimán.

## Typography

Palabras de voz de marca: **grabado, sobrio, con peso.** El objeto físico de
referencia no es una revista: es una placa de latón grabada y un certificado
notarial impreso en tipografía.

- **Display — Marcellus (400) y Marcellus SC.** Capital romana inscripcional.
  La marca se llama *Monte Sacro*: la letra romana tallada no es decoración, es
  el nombre. Da hairlines finos como el wordmark del manual sin caer en didone
  de portada de moda ni en serif de boda. Sin bold: la jerarquía sale del tamaño
  y de la caja, no del peso.
- **Body — Archivo (300/400/500/600).** Grotesca sobria, pensada para impresos
  de alto contraste y tablas. Sostiene fichas técnicas sin verse de software.
  Contraste real contra Marcellus por eje (inscripcional vs. neo-grotesca).
- **Cifras — `troquel`**: Archivo con `tabular-nums` y tracking abierto. Medidas,
  gramajes, códigos y números de serie se leen como un troquel, no como un dato
  de app.

Escala fluida, razón ≥1.25. Techo de display: `clamp(2.75rem, 7vw, 5.75rem)`
(92px). Tracking de display: `-0.02em`, nunca por debajo de `-0.03em`.
`text-wrap: balance` en h1–h3, `pretty` en prosa. Prosa capada a 68ch.

Sobre fondo oscuro, `line-height` sube 0.08 respecto de la versión sobre claro.

### Las dos secuencias numeradas

El sistema evita la numeración decorativa `01 / 02 / 03`. Solo hay dos sitios
con números, y en los dos el orden es real y el lector lo necesita:

1. Los cuatro elementos del empaque, de afuera hacia adentro.
2. Los cuatro pasos del pedido, y los cuatro de producción en la confirmación.

**Prohibido:** mayúsculas trackeadas pequeñas como eyebrow encima de cada
sección. Las versalitas reales (`versalita`) se usan solo en la navegación, en
los pies de ficha técnica y en el sello — lugares nombrados, no gramática de
sección.

## Layout

- Contenedor: `--medida-ancho: 78rem`, con canal de `clamp(1.25rem, 5vw, 5rem)`.
- Ritmo vertical variable: bloques de respiro `clamp(5rem, 12vw, 11rem)`, grupos
  apretados a `1.5rem`. Nada de espaciado uniforme entre secciones.
- **Las piezas en la portada no son cards.** Son bandas horizontales que
  alternan lado.
- El catálogo es una retícula de celdas desiguales: la primera pieza ocupa dos
  columnas.
- Ficha de producto: galería pegajosa a la izquierda, columna de compra a la
  derecha, ficha técnica en mundo contrario a ancho completo debajo.
- Radios: `--radius-ficha: 2px`, `--radius-panel: 4px`. La marca es de cantos
  vivos y bordes pintados a mano. Excepción: el selector de fondo, que es
  `rounded-full` porque tiene que leerse como un interruptor — y es lo único
  del sitio que no forma parte del producto.
- Escala de z-index semántica: `--z-base`, `--z-pegajoso`, `--z-nav`,
  `--z-velo`, `--z-dialogo`. Nunca valores literales.

**Prohibido:** cards anidadas, borde lateral de color como acento, sombra difusa
combinada con borde de 1px.

## Components

Todo lo de producto se alimenta de `src/data/productos.js`. Un solo objeto
describe una pieza; las cuatro vistas lo consumen.

| Componente | Qué hace |
|---|---|
| `Monograma` | SVG del monograma MS. Único logo del sitio. |
| `Logotipo` | Wordmark MONTESACRO + bajada LEATHER GOODS. |
| `Iconos` | Menú, cerrar y bolsa. Trazo de 1px, el mismo grosor que el filete. |
| `Reveal` | Entrada por `whileInView`, una sola vez. Visible por defecto con `reduce`. |
| `SelectorColor` | Fichas de piel. Nombre visible + `aria-pressed` + filete activo. |
| `GaleriaProducto` | Imagen principal + miniaturas, navegable por teclado, con cambio por colorway. |
| `FichaTecnica` | `<dl>` de specs con numeración tabular. |
| `TarjetaPieza` | Celda de catálogo: foto, nombre, precio, familia, cintas de colorway. |
| `PlacaIniciales` | Vista previa de la placa grabada. Mundo cuero. |
| `PersonalizacionCompacta` | La versión de la columna de compra, opcional y apagada por defecto. |
| `BloquePersonalizacion` | La versión a página completa de la experiencia. |
| `SelloAutenticidad` | Tarjeta numerada N° 000123. |
| `InterruptorTema` | Control segmentado Claro/Oscuro, **en el pie**, no en el encabezado: es andamiaje de revisión y no debe ocupar sitio en el recorrido de compra. Dice "Claro/Oscuro" y no "Arcilla/Piel" porque ahí la claridad vale más que la voz de marca. **Se borra al elegir dirección.** |
| `carrito/BotonCarrito` · `carrito/CajonCarrito` | Carrito de solo UI. |
| `Campo` | `CampoTexto`, `CampoSelect` y `GrupoOpciones`. Etiqueta siempre visible, error por `aria-describedby` + filete de alerta, nunca solo por color. |
| `ResumenPedido` | Ficha del pedido en mundo contrario: un pedido es un documento. No muestra totales porque no hay precios reales. |

## Motion

Una sola gramática: **aparecer desde abajo, 16px, 0.7s, `--ease-salida`
(`cubic-bezier(0.16, 1, 0.3, 1)`)**, escalonada dentro de una lista, nunca
sección por sección de forma idéntica.

Excepciones deliberadas:
- Portada: la fotografía escala de 1.06 a 1 en 1.6s mientras el titular sube.
- Cambio de colorway: fundido cruzado de 0.45s sobre la imagen principal.
- Secuencia de unboxing: cada paso entra con `clip-path` de abajo hacia arriba,
  porque el contenido *es* una apertura.
- Cajón del carrito: entra desde el borde derecho en 0.55s.
- Selector de fondo: la pastilla se desliza entre las dos opciones en 0.45s
  (`layoutId`); el lienzo de la página cruza en 0.5s.

`prefers-reduced-motion: reduce` → todo pasa a fundido de 0.01s, sin
desplazamiento ni `clip-path`. Nada queda oculto si el observador no dispara.

**Prohibido:** rebote, elástico, parallax de fondo, animación de propiedades de
layout.

## Imagery

Fotografía a sangre, mucha, con luz lateral dura. La foto es el diseño.

El prototipo usa Unsplash (IDs verificados) como marcador de posición. **Todas
las rutas viven en `src/data/imagenes.js`.** Pasar a fotografía real de
MONTESACRO es editar ese archivo, nada más.

Alt en voz de marca: "Bolso de mano en caimán, herraje dorado antiguo, luz de
estudio lateral", no "bolso negro".
