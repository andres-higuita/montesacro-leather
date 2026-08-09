/**
 * Los colores del tema, leídos como números.
 *
 * El sistema visual vive en variables CSS y en oklch (ver `index.css`): los
 * componentes consumen ROLES —`--color-acento`, `--color-realce`— y nunca un
 * hex. Un shader no puede hacer eso: WebGL quiere tres flotantes de 0 a 1.
 *
 * Aquí se cierra ese hueco sin romper la regla. En vez de copiar los hex a
 * mano —que es como los shaders se desincronizan del tema a la segunda
 * semana—, se le pide al navegador que resuelva la variable y se pinta el
 * resultado en un lienzo de un píxel. Lo que salga de `getImageData` es sRGB
 * de ocho bits, venga la variable en oklch, en hex o en lo que se invente la
 * especificación el año que viene.
 *
 * Un lienzo de 1×1 y no `getComputedStyle` a secas: el valor calculado de una
 * custom property se devuelve TAL CUAL se escribió —`oklch(0.68 0.082 82)`—,
 * sin convertir. Parsear oklch a mano son cuarenta líneas de conversión de
 * espacio de color que el canvas ya tiene hechas.
 */

/* Un solo lienzo para todas las lecturas: crear uno por color es basura para
   el recolector, y estas lecturas ocurren en el montaje de cada escena. */
let sonda = null

function obtenerSonda() {
  if (!sonda) {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    sonda = canvas.getContext('2d', { willReadFrequently: true })
  }
  return sonda
}

/**
 * Resuelve una variable CSS de color a un trío 0-1 listo para un uniform.
 *
 * @param {string} variable  Nombre de la custom property, con los dos guiones.
 * @param {[number, number, number]} respaldo  Valor si el navegador no sabe
 *   pintar la notación. Va en 0-1, igual que lo que se devuelve.
 * @param {Element} [desde]  Nodo desde el que resolver. Importa: los mundos
 *   (`mundo-vino`, `mundo-contra`) reasignan los roles por subárbol, así que
 *   `--color-acento` no vale lo mismo en la banda de identidad que en el
 *   cuerpo del sitio. Por defecto, la raíz.
 * @returns {[number, number, number]}
 */
export function leerColor(variable, respaldo, desde = document.documentElement) {
  const crudo = getComputedStyle(desde).getPropertyValue(variable).trim()
  if (!crudo) return respaldo

  const ctx = obtenerSonda()
  try {
    /* Se limpia antes de pintar: `fillStyle` con un valor que el navegador no
       entiende se queda con el anterior en vez de fallar, y sin limpiar
       devolveríamos el color de la lectura pasada como si fuera esta. */
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#000000'
    ctx.fillStyle = crudo
    if (ctx.fillStyle === '#000000' && crudo !== '#000000') return respaldo

    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r / 255, g / 255, b / 255]
  } catch {
    return respaldo
  }
}
