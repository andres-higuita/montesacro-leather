# MONTESACRO · storefront (prototipo)

Prototipo de dirección de diseño y UX para MONTESACRO Leather Goods.
**Solo frontend.** Sin backend, sin checkout, sin pagos. Existe para decidir
Shopify vs. desarrollo a medida antes de invertir en cualquiera.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Qué hay

| Ruta | Vista |
|---|---|
| `/` | Portada, manifiesto, las tres piezas, el cierre exclusivo, antesala del empaque |
| `/catalogo` | Las tres piezas con precio, familia y las cuatro pieles a la vista |
| `/producto/:slug` | Ficha completa: galería, selector de piel, medidas, personalización, carrito, ficha técnica |
| `/experiencia` | Los cuatro elementos del empaque, la tarjeta de autenticidad, la placa de iniciales |
| `/checkout` | Pedido en cuatro pasos: contacto → entrega → pago → revisión |
| `/pedido-confirmado` | Cierre del flujo: número de pedido, serie por pieza y qué pasa después |

Slugs: `bolso-de-mano`, `tarjetero`, `neceser`.
`/tienda` redirige a `/catalogo`; `/pieza/:id` redirige a `/producto/:slug`.

El **carrito** vive en el encabezado y abre un cajón lateral. Añade, cambia
cantidad y retira; guarda la piel y las iniciales de cada línea. Desde ahí se
entra al pedido.

### El flujo de pedido

Cuatro pasos con validación de formato, resumen fijo al lado y confirmación
final que asigna un número de serie a cada pieza. **Nada sale del navegador:**
no hay servidor, ni almacenamiento, ni cobro.

Por eso el paso de pago lleva un aviso permanente pidiendo que no se escriban
datos reales de tarjeta, y sus campos van con `autoComplete="off"` y sin los
nombres `cc-*`, para que el navegador no ofrezca una tarjeta guardada de verdad
en un formulario que no cifra nada. **Si este prototipo se publica en una URL
accesible, ese aviso no es opcional.**

Al conectar un backend de verdad, los datos de tarjeta no deben pasar por este
formulario: se usa el campo alojado del proveedor de pagos (Stripe Elements,
Wompi, o el que sea) y aquí solo queda el token.

## Las dos direcciones visuales

El **pie de página** lleva un selector Claro / Oscuro para comparar en vivo.
Está ahí y no en el encabezado a propósito: es andamiaje de revisión y no debe
ocupar sitio en el recorrido de compra.

- **Arcilla** (por defecto) — el vinotinto de la marca subido a luminosidad
  alta. Fondo claro, no blanco.
- **Piel** — la dirección oscura original.

Es una herramienta de revisión, no una preferencia de producto. **Al elegir
dirección, se borra así:**

1. Borrar `src/components/InterruptorTema.jsx`, y de `src/tema/` los archivos
   `contexto.js` y `ProveedorTema.jsx` (`cabecera.js` y `ProveedorCabecera.jsx`
   se quedan: son del encabezado, no del tema).
2. En `src/components/PieDePagina.jsx`, borrar el import y la banda "Fondo del
   prototipo" entera.
3. Quitar el `<ProveedorTema>` de `src/main.jsx`.
4. Quitar el `<script>` de tema en `index.html` y dejar la clase ganadora fija
   en `<html class="tema-arcilla">` o `tema-piel`.

Ningún componente cambia: todos consumen roles de color, no colores.

## Dónde tocar cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Colores, tipografía, medidas, temas, mundos | `src/index.css` |
| Fotografías | `src/data/imagenes.js` — **único** archivo con URLs de imagen |
| Piezas, specs, colorways, precios, códigos, empaque | `src/data/productos.js` |
| Comportamiento del carrito | `src/carrito/CarritoContexto.jsx` |
| Por qué el sistema es así | `DESIGN.md` |
| A quién le hablamos y qué evitamos | `PRODUCT.md` |

### Cambiar las fotos por las reales

Todas las imágenes son marcadores de posición de Unsplash. Para sustituirlas:

1. Poner los archivos en `public/fotos/`.
2. En `src/data/imagenes.js`, cambiar cada `id` por la ruta local
   (`/fotos/bolso-caiman-negro.jpg`) y reescribir el `alt` en voz de marca.

`foto()` detecta que la ruta no es un id de Unsplash y la devuelve tal cual.
Ningún otro archivo del proyecto referencia una imagen.

## Decisiones que conviene conocer antes de revisar

- **Paleta y roles.** Los componentes nunca usan un color de marca directo: usan
  roles (`grafia`, `lienzo`, `acento`). Por eso hay dos temas sin código
  duplicado. Detalle en `DESIGN.md`.
- **Dos mundos materiales.** Las secciones de producto viven en el lienzo del
  tema; las de documentación —specs, empaque, autenticidad— viven en el mundo
  contrario. La alternancia sale del collection book.
- **El logo se gana su aparición.** El monograma MS aparece solo donde la pieza
  física lo lleva: cierre, placa interior, sello y favicon.
- **La única secuencia numerada del sitio** es el empaque, porque es un orden
  real: de afuera hacia adentro.
- **Tipografía:** Marcellus (capital romana inscripcional, por *Monte Sacro*)
  para títulos; Archivo para cuerpo y fichas técnicas.

## Estado de los datos

- Herrajes, empaque, gramajes y medidas de caja y bolsa: **literales** del
  collection book.
- Medidas de la pieza, peso y código: **estimados / inventados** para el
  prototipo. Pendientes de confirmar con producción.
- Precios: el literal `Desde $XXX`. Se deja así a propósito — una cifra
  inventada en una marca de lujo induce a error en la revisión.
- Copy: redactado para el prototipo. No está aprobado por la marca.
