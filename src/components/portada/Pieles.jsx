import { useState } from 'react'
import { COLORWAYS, PRODUCTOS } from '../../data/productos'
import { IMG_PRODUCTO } from '../../data/imagenes'

const PIEZA = PRODUCTOS[0]
const FOTOS = IMG_PRODUCTO[PIEZA.id].colorways

/**
 * Las cuatro pieles.
 *
 * Un selector que cambia la pieza en vivo, no una rejilla de cuatro tarjetas.
 * La diferencia importa: en rejilla el visitante compara CUATRO FOTOGRAFÍAS, y
 * como cada una está tomada con su propia luz, termina comparando iluminación.
 * En un solo hueco que cambia de piel compara EL MATERIAL, que es lo único que
 * cambia de verdad entre las cuatro.
 *
 * Las cuatro tomas se montan a la vez y se cruzan por opacidad en lugar de
 * cambiar el `src` de un solo `<img>`: cambiando el `src` la primera vuelta por
 * cada piel deja el hueco en blanco mientras descarga, y ese parpadeo delata
 * que son cuatro archivos distintos justo cuando el argumento es que es la
 * misma pieza.
 */
export default function Pieles() {
  const [activa, setActiva] = useState(PIEZA.colorways[0])

  return (
    <section
      id="pieles"
      aria-label="Las cuatro pieles"
      className="relative bg-obsidiana py-[clamp(4rem,9vw,7rem)]"
    >
      <div className="canal">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="versalita text-nota text-acento">04 / Las pieles</p>
            <h2 className="mt-5 max-w-[16ch] font-[family-name:var(--font-display)] text-portada leading-[1.08] text-marfil">
              La misma horma, cuatro materiales
            </h2>
          </div>

          <p className="max-w-[38ch] text-menor leading-relaxed text-humo">
            Todas curtidas al vegetal y con el mismo herraje de níquel pulido. Lo
            único que cambia es la piel — y con ella, cómo envejece la pieza.
          </p>
        </div>

        {/* El hueco de la pieza. `aspect` fijo y no alto automático: sin él, la
            primera toma en cargar marca el alto y las demás lo empujan. */}
        <div className="relative mt-[clamp(2.5rem,6vw,4rem)] aspect-[16/10] w-full overflow-hidden rounded-panel bg-obsidiana">
          {PIEZA.colorways.map((id) => {
            const foto = FOTOS[id]
            if (!foto) return null
            return (
              <img
                key={id}
                src={foto.id}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
                aria-hidden={id !== activa}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  id === activa ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )
          })}
        </div>

        {/* El selector. Botones y no una lista de enlaces: no navega a ningún
            sitio, cambia el estado de esta sección. */}
        <div
          role="radiogroup"
          aria-label="Elegí la piel"
          className="mt-[clamp(1.75rem,4vw,2.5rem)] grid grid-cols-2 gap-px overflow-hidden rounded-ficha border border-acento/25 bg-acento/25 sm:grid-cols-4"
        >
          {PIEZA.colorways.map((id) => {
            const piel = COLORWAYS[id]
            const puesta = id === activa
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={puesta}
                onClick={() => setActiva(id)}
                className={`group flex items-center gap-4 bg-obsidiana px-5 py-4 text-left transition-colors duration-300 hover:bg-lienzo-alto ${
                  puesta ? 'bg-lienzo-alto' : ''
                }`}
              >
                {/* La muestra lleva anillo siempre, no solo cuando está
                    elegida: sin anillo, la muestra negra sobre obsidiana
                    desaparece y el botón se queda sin su dato principal. */}
                <span
                  aria-hidden="true"
                  className={`h-7 w-7 shrink-0 rounded-full ring-1 transition-all duration-300 ${
                    puesta ? 'ring-2 ring-acento' : 'ring-marfil/25'
                  }`}
                  style={{ background: piel.token }}
                />
                <span className="min-w-0">
                  <span
                    className={`block truncate text-menor transition-colors duration-300 ${
                      puesta ? 'text-marfil' : 'text-humo'
                    }`}
                  >
                    {piel.nombre}
                  </span>
                  <span className="troquel block text-nota text-humo/70">
                    {PIEZA.codigo}-{piel.codigo}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
