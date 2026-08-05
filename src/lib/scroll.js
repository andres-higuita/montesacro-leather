/**
 * El scroll suavizado, accesible desde fuera de su componente.
 *
 * `SuavizadoScroll` crea la instancia de Lenis y la deja aquí. Quien necesite
 * MOVER la página —el salto al inicio al cambiar de ruta, un ancla— tiene que
 * pedírselo a Lenis y no al navegador: Lenis guarda su propia posición de
 * destino e interpola hacia ella en cada fotograma, así que un `window.scrollTo`
 * a pelo se deshace solo en el frame siguiente. Ese era el motivo de que al
 * entrar en una ficha desde el inicio la página se quedara a media altura.
 *
 * Un módulo con una variable y no un contexto de React: esto no es estado que
 * deba provocar renders, es una referencia a un objeto imperativo. Con contexto
 * habría que envolver el árbol entero para nada.
 */
let lenis = null

export function registrarLenis(instancia) {
  lenis = instancia
}

/**
 * Lleva la página a un sitio, con o sin scroll suavizado instalado.
 *
 * @param {number|Element} destino  Píxeles desde arriba, o el nodo al que ir.
 * @param {{ suave?: boolean }} opciones
 */
export function irA(destino, { suave = false } = {}) {
  if (lenis) {
    lenis.scrollTo(destino, { immediate: !suave })
    return
  }

  /* Sin Lenis —con `prefers-reduced-motion` no se instala— manda el navegador.
     `scrollTo` con objeto y no con dos números: `html` lleva `scroll-behavior:
     smooth` en el CSS del sitio, y sin `behavior: 'instant'` el salto al inicio
     se convertiría en un viaje animado por toda la página. */
  if (typeof destino === 'number') {
    window.scrollTo({ top: destino, left: 0, behavior: suave ? 'smooth' : 'instant' })
  } else {
    destino.scrollIntoView({ behavior: suave ? 'smooth' : 'instant', block: 'start' })
  }
}
