/**
 * Bloque de sección. No anima.
 *
 * Antes era `Reveal` y subía 16 px fundiéndose al entrar en pantalla. Se
 * quitó al medir MORAE: sus bloques dan `transform: none` y `opacity: 1` en
 * todas las posiciones de scroll, y en toda la página no hay un solo
 * `@keyframes` con transform. Su movimiento vive en otra parte —el scroll
 * suavizado, el hero fijo, las fotografías fijadas— y los bloques de texto
 * simplemente están ahí.
 *
 * Se conserva el componente, y no se sustituye por `<div>` suelto, porque
 * marca en el marcado dónde empieza cada bloque de una sección y deja un
 * único sitio donde volver a introducir movimiento si algún día se decide.
 */
export default function Bloque({ children, className = '', as: Etiqueta = 'div', ...resto }) {
  return (
    <Etiqueta className={className} {...resto}>
      {children}
    </Etiqueta>
  )
}
