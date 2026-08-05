import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { COLORWAYS } from '../../data/productos'
import { IMG_PRODUCTO, juegoDeFotos } from '../../data/imagenes'

/**
 * Las pieles de la pieza, a pantalla completa.
 *
 * La fotografía manda y las fichas de piel van debajo, en una fila. Al elegir
 * una, la imagen hace fundido cruzado —0.5 s, la duración de fundido del
 * sistema— y el pie cambia con ella. No hay animación de entrada ni de salida
 * más allá de eso: el cambio de piel ES el movimiento de este bloque.
 *
 * El estado vive en la ficha de producto, no aquí: la piel elegida tiene que
 * llegar igual al código de referencia, a la ficha técnica y al carrito.
 */
export default function PanelPieles({ producto, colorway, alCambiar, id, copy }) {
  const reducido = useReducedMotion()
  const bloque = IMG_PRODUCTO[producto.id]
  const toma = bloque?.colorways?.[colorway]
  if (!toma) return null

  /* El titular por defecto vende piel exótica de patrón irrepetible, que es lo
     que son el tarjetero y el neceser. La pieza que se fotografió lleva relieve
     de caimán en patrón regular y las cuatro pieles son idénticas salvo el
     tono: ahí ese titular es mentira, y la escena manda el suyo. */
  const titular = copy?.titulo ?? `${producto.colorways.length} pieles. El mismo patrón, nunca.`
  const entrada =
    copy?.texto ??
    'Todas curtidas al vegetal, todas con el canto pintado a mano. El color madura con los años: a los cinco no se parece al del catálogo, y esa es la idea.'

  const { src, srcSet } = juegoDeFotos(toma.id, [800, 1400, 2000])

  return (
    <section id={id} className="bg-black py-[clamp(4rem,10vw,8rem)]">
      <div className="canal">
        <p className="versalita text-nota text-oro">Las pieles</p>
        <h2 className="mt-6 max-w-[18ch] font-[family-name:var(--font-display)] text-portada leading-[1.06] text-marfil">
          {titular}
        </h2>
        <p className="mt-7 max-w-[52ch] text-menor leading-relaxed text-humo">{entrada}</p>
      </div>

      <div className="canal mt-[clamp(2.5rem,6vw,4.5rem)]">
        <div
          className="relative overflow-hidden bg-lienzo-alto"
          style={{ aspectRatio: '16 / 10' }}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.img
              key={`${producto.id}-${colorway}`}
              src={src}
              srcSet={srcSet}
              sizes="(min-width: 78rem) 68rem, 100vw"
              alt={toma.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              initial={reducido ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducido ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>

        {/* Fichas de piel. El color nunca es el único portador: cada una lleva
            su nombre visible y `aria-pressed`. */}
        <div
          className="mt-8 flex flex-wrap items-start gap-x-10 gap-y-6"
          role="group"
          aria-label="Piel de la pieza"
        >
          {producto.colorways.map((piel) => {
            const cw = COLORWAYS[piel]
            const activa = piel === colorway

            return (
              <button
                key={piel}
                type="button"
                onClick={() => alCambiar(piel)}
                aria-pressed={activa}
                className="group flex items-center gap-4"
              >
                <span
                  className="relative block h-9 w-9 rounded-ficha transition-transform duration-500 ease-[var(--ease-salida)] group-hover:scale-[1.08]"
                  style={{ backgroundColor: cw.token }}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -inset-[5px] rounded-ficha border border-oro transition-opacity duration-400 ${
                      activa ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-ficha"
                    style={{
                      boxShadow:
                        'inset 0 1px 0 rgb(255 255 255 / 0.14), inset 0 -6px 10px rgb(0 0 0 / 0.35)',
                    }}
                  />
                </span>

                <span className="text-left">
                  <span
                    className={`block text-menor transition-colors duration-300 ${
                      activa ? 'text-marfil' : 'text-humo'
                    }`}
                  >
                    {cw.nombre}
                  </span>
                  <span className="troquel block text-nota text-humo/70">{cw.codigo}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
