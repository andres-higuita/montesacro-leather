/**
 * Pictogramas de interfaz.
 *
 * Trazo de 1px, mismo grosor que el filete del sistema: los iconos se leen
 * como parte del mismo dibujo técnico que las fichas y los planos del
 * collection book, no como iconografía de aplicación.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  'aria-hidden': true,
}

/** Menú. Tres trazos, el último más corto: es un dibujo, no tres iguales. */
export function IconoMenu({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" {...base}>
      <path d="M2.5 6h15" />
      <path d="M2.5 10h15" />
      <path d="M2.5 14h9.5" />
    </svg>
  )
}

export function IconoCerrar({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" {...base}>
      <path d="M4.5 4.5l11 11" />
      <path d="M15.5 4.5l-11 11" />
    </svg>
  )
}

/**
 * Bolsa de compra de la marca (cuerpo y cordón), no un carrito de supermercado:
 * el objeto que el cliente se lleva de la tienda es una bolsa, y el sistema de
 * empaque es parte de la identidad.
 */
export function IconoBolsa({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" {...base}>
      <path d="M3.6 6.4h12.8l-.9 11.2H4.5L3.6 6.4Z" />
      <path d="M7.1 6.4V4.9a2.9 2.9 0 0 1 5.8 0v1.5" />
    </svg>
  )
}
