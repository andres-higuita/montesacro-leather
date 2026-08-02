import { Link } from 'react-router-dom'
import { juegoDeFotos, IMG_PRODUCTO } from '../data/imagenes'

/**
 * Las tres piezas, apiladas.
 *
 * Cada pieza es un panel de una pantalla exacta que se queda clavado arriba, y
 * el siguiente sube y lo TAPA en vez de empujarlo. Al final del recorrido los
 * tres están superpuestos, con el último encima.
 *
 * Tres condiciones, y las tres son necesarias:
 *
 * 1. Los paneles son hermanos `sticky top-0` dentro del MISMO padre. Así el
 *    bloque contenedor de los tres es el contenedor entero y el primero sigue
 *    pegado arriba mientras entra el segundo. Con un `sticky` por fila, el
 *    contenedor de cada uno termina donde empieza el siguiente, así que el de
 *    arriba sale empujado justo cuando el de abajo entra: se cruzan.
 *
 * 2. El panel mide EXACTAMENTE una pantalla y la fotografía la llena entera,
 *    sin margen. Si la imagen es más baja que el panel, lo que sube primero es
 *    la franja negra de encima y se lee como un marco: el movimiento se vuelve
 *    tosco y la pieza nueva nunca llega a tapar a la anterior.
 *
 * 3. Los paneles son opacos. Uno transparente deja ver el de debajo.
 *
 * La fotografía va siempre al mismo lado. Alternarla parte el apilado, porque
 * cada panel taparía una mitad distinta.
 *
 * En móvil no se apila: una sola columna no tiene sitio para la ficha al lado,
 * y recortar a una pantalla dejaría el texto fuera.
 */

export default function PiezasApiladas({ productos }) {
  return (
    <div className="relative">
      {productos.map((producto, indice) => {
        const imagenes = IMG_PRODUCTO[producto.id]
        const portada = imagenes?.colorways?.[producto.colorways[0]]
        const { src, srcSet } = juegoDeFotos(portada.id, [700, 1100, 1600])

        return (
          <section
            key={producto.id}
            aria-label={producto.nombre}
            className="bg-black lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden"
          >
            <div className="grid lg:h-full lg:grid-cols-2">
              {/* Fotografía a sangre: alto completo del panel, sin margen */}
              <Link
                to={`/producto/${producto.slug}`}
                className="block h-[52svh] overflow-hidden lg:h-full"
              >
                <img
                  src={src}
                  srcSet={srcSet}
                  sizes="(min-width: 64rem) 50vw, 100vw"
                  alt={portada.alt}
                  loading={indice === 0 ? undefined : 'lazy'}
                  className="h-full w-full object-cover"
                />
              </Link>

              {/* Ficha, centrada en el alto del panel */}
              <div className="flex items-center px-[var(--medida-canal)] py-[clamp(3rem,8vw,5rem)] lg:px-[clamp(2.5rem,5vw,5.5rem)] lg:py-0">
                <div className="w-full">
                  <p className="troquel text-menor text-oro">
                    [{String(indice + 1).padStart(2, '0')}]
                  </p>

                  <h3 className="mt-5 flex gap-4 font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
                    <span aria-hidden="true" className="text-oro">/</span>
                    <span>{producto.nombre}</span>
                  </h3>

                  <p className="versalita mt-4 text-nota text-humo">{producto.familia}</p>

                  <p className="mt-7 max-w-[44ch] text-menor leading-relaxed text-humo">
                    {producto.resumen}
                  </p>

                  <dl className="mt-9 max-w-[24rem] border-t border-oro/34">
                    {[...producto.specs.medidas, ['Peso', producto.peso]].map(
                      ([clave, valor]) => (
                        <div
                          key={clave}
                          className="flex items-baseline justify-between gap-6 border-b border-oro/34 py-2.5"
                        >
                          <dt className="shrink-0 text-nota text-humo">{clave}</dt>
                          <dd className="troquel text-right text-nota text-marfil">
                            {valor}
                          </dd>
                        </div>
                      ),
                    )}
                  </dl>

                  <Link
                    to={`/producto/${producto.slug}`}
                    className="versalita mt-9 inline-block border-b border-acento pb-1.5 text-menor text-marfil transition-colors duration-400 hover:text-acento"
                  >
                    Ficha completa
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
