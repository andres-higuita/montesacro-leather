# Product

## Register

brand

## Users

Coleccionista adulto (38–60), alto poder adquisitivo, latinoamericano o expatriado.
Compra pocas piezas y las conserva décadas. Llega al sitio de noche, desde el
escritorio o el celular, después de haber visto la pieza en persona o de que
alguien se la mencionó. No está descubriendo una categoría: está verificando si
la marca merece su dinero.

El trabajo que necesita hacer: **confirmar que esto es serio.** Materiales reales,
medidas reales, herrajes reales, un objeto que se puede heredar. El precio no es
la objeción; la objeción es "¿esto es lujo o parece lujo?".

Este storefront es un prototipo de dirección de diseño y UX. No hay checkout,
precios ni pasarela de pago. Sirve para decidir Shopify vs. desarrollo a medida.

## Product Purpose

Presentar tres piezas de marroquinería en piel exótica —bolso de mano, tarjetero
y neceser— con el nivel de detalle de un catálogo técnico y el silencio de una
casa que no necesita gritar su nombre. El éxito es que alguien recorra las cuatro
vistas y salga convencido de la calidad sin haber visto un solo logo grande.

El diferenciador real de MONTESACRO no es el producto solo: es el sistema completo
(bolsa de compra → caja rígida → bolsa de algodón → tarjeta de autenticidad
numerada). La sección "La Experiencia" tiene que pesar tanto como el catálogo.

## Brand Personality

**Grabada, sobria, con peso.** Voz de certificado, no de campaña. Frases cortas,
afirmativas, sin adjetivos de venta. Nunca "increíble", "exclusivo para ti",
"date el lujo". Sí: medidas, materiales, procesos, números de serie.

El lujo silencioso aquí es literal: el logo aparece dos veces por pieza, en el
cierre metálico y en la placa interior. La web imita esa regla — el monograma MS
aparece poco y pequeño, y cuando aparece, cuenta.

Emoción objetivo: **certeza tranquila.** No aspiración, no deseo urgente.

## Anti-references

- **Shopify genérico.** Nada de badges de descuento, carrusel de reseñas, barra de
  "envío gratis", contador de stock, cards idénticas en grid de 3.
- **Lujo caricaturesco.** Nada de dorado brillante por todas partes, mármol,
  serif de invitación de boda, "ELEGANCE" en mayúsculas trackeadas, fondo negro
  con una sola foto centrada y flotante.
- **Editorial-revista.** Nada de serif itálico gigante + labels mono + columnas
  con líneas divisorias. Es la estética IA saturada de 2026.
- **Startup/SaaS.** Nada de gradientes, glassmorphism, cards con sombra difusa,
  hero de métricas grandes.

## Design Principles

1. **La ficha técnica es el argumento de venta.** Medidas en centímetros, gramajes,
   nombre del sistema de cierre (YKK Excella®), material del herraje (zamak macizo).
   La especificidad es la prueba. Donde otra marca pondría copy emotivo, va un dato.
2. **Dos mundos materiales: piel y papel.** Las secciones de producto viven en piel
   (vinotinto profundo, casi negro). Las secciones de documentación —specs, empaque,
   autenticidad— viven en papel (marfil). La alternancia es la estructura, no la
   decoración, y sale del collection book real de la marca.
3. **El logo se gana su aparición.** Igual que en la pieza física: el monograma MS
   solo donde hay una razón (cierre, placa, sello de autenticidad, favicon). Nunca
   como adorno repetido.
4. **La caja es parte del producto.** El unboxing tiene su propia página y su propia
   dirección de arte. Es la única secuencia numerada del sitio, porque es una
   secuencia real: de afuera hacia adentro.
5. **Silencio antes que abundancia.** Un tipo de movimiento, un acento dorado, un
   ancho de columna. Si algo se puede quitar sin perder información, se quita.

## Accessibility & Inclusion

- WCAG 2.2 AA. Texto de cuerpo ≥4.5:1, títulos grandes ≥3:1. El dorado
  (`--ms-oro`) nunca se usa para texto de cuerpo, solo para filetes, el monograma
  y títulos grandes sobre fondo oscuro.
- `prefers-reduced-motion: reduce` reemplaza todo desplazamiento por fundido
  instantáneo. Ninguna información depende del movimiento.
- El selector de color no comunica solo por color: cada opción tiene nombre
  visible, `aria-pressed` y foco visible.
- Foco visible con filete dorado de 2px en todo elemento interactivo. Navegación
  completa por teclado, incluida la galería de producto.
- Imágenes con alt descriptivo en voz de marca, no genérico.
