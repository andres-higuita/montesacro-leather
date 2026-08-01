import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IMG_PRODUCTO, juegoDeFotos } from '../data/imagenes'
import { COLORWAYS } from '../data/productos'

/**
 * Galería de pieza.
 *
 * La primera toma siempre es la del colorway activo; detrás van las tomas de
 * detalle, comunes a todas las pieles. Al cambiar de piel la vista vuelve a la
 * toma 1 y la imagen principal hace fundido cruzado (0.45s, ver DESIGN.md).
 */
export default function GaleriaProducto({ productoId, colorway }) {
  const reducido = useReducedMotion()
  const [indice, setIndice] = useState(0)

  const tomas = useMemo(() => {
    const bloque = IMG_PRODUCTO[productoId]
    if (!bloque) return []
    return [bloque.colorways[colorway], ...bloque.galeria].filter(Boolean)
  }, [productoId, colorway])

  useEffect(() => {
    setIndice(0)
  }, [colorway, productoId])

  if (!tomas.length) return null

  const principal = tomas[Math.min(indice, tomas.length - 1)]
  const { src, srcSet } = juegoDeFotos(principal.id, [800, 1200, 1800])

  return (
    <div>
      <div
        className="relative overflow-hidden bg-lienzo-alto"
        style={{ aspectRatio: '4 / 5' }}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={`${colorway}-${principal.id}`}
            src={src}
            srcSet={srcSet}
            sizes="(min-width: 64rem) 46vw, 100vw"
            alt={principal.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={reducido ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducido ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
      </div>

      {tomas.length > 1 && (
        <ul className="mt-3 flex gap-3" aria-label="Otras tomas de la pieza">
          {tomas.map((toma, i) => {
            const activa = i === indice
            return (
              <li key={toma.id}>
                <button
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-current={activa ? 'true' : undefined}
                  aria-label={`Toma ${i + 1} de ${tomas.length}: ${toma.alt}`}
                  className={`relative block h-20 w-16 overflow-hidden transition-opacity duration-400 sm:h-24 sm:w-20 ${
                    activa ? 'opacity-100' : 'opacity-55 hover:opacity-85'
                  }`}
                >
                  <img
                    src={juegoDeFotos(toma.id, [160, 240, 320]).src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 border transition-colors duration-400 ${
                      activa ? 'border-acento' : 'border-transparent'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-4 text-nota text-grafia-suave">
        Piel · {COLORWAYS[colorway]?.nombre}. Cada corte es único: el patrón de escamas
        nunca se repite entre dos piezas.
      </p>
    </div>
  )
}
