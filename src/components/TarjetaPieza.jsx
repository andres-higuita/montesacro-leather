import { Link } from 'react-router-dom'
import { IMG_PRODUCTO } from '../data/imagenes'
import { COLORWAYS } from '../data/productos'
import Foto from './Foto'

/**
 * Celda de catálogo. No es una card: no lleva contenedor, ni borde, ni sombra.
 * Es una fotografía con su pie, como en el collection book.
 *
 * Los cuatro swatches se muestran siempre, sin ser seleccionables: desde el
 * grid informan la carta disponible; elegir piel es asunto de la ficha.
 *
 * `destacada` la hace ocupar dos columnas y cambiar de encuadre.
 */
export default function TarjetaPieza({ producto, destacada = false }) {
  const imagenes = IMG_PRODUCTO[producto.id]
  const primerCw = producto.colorways[0]
  const portada = imagenes?.colorways?.[primerCw]

  return (
    <article className={destacada ? 'lg:col-span-2' : ''}>
      <Link to={`/producto/${producto.slug}`} className="group block">
        <Foto
          imagen={portada}
          ratio={destacada ? '16 / 11' : '4 / 5'}
          sizes={
            destacada
              ? '(min-width: 64rem) 66vw, 100vw'
              : '(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw'
          }
          imgClassName="transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
        />

        <div className="mt-6 flex items-baseline justify-between gap-6">
          <h3 className="text-mayor text-grafia">
            <span className="vinculo vinculo-grupo">{producto.nombre}</span>
          </h3>
          <span className="troquel shrink-0 text-menor text-grafia-suave">
            {producto.precioDesde}
          </span>
        </div>

        <p className="versalita mt-2.5 text-nota text-acento">{producto.familia}</p>
        <p className="prosa mt-3 text-menor text-grafia-suave">{producto.resumen}</p>
      </Link>

      {/* Fuera del <Link>: es información, no un control. */}
      <div className="mt-6 flex items-center gap-4">
        <ul className="flex items-center gap-2" aria-label="Pieles disponibles">
          {producto.colorways.map((id) => (
            <li key={id}>
              <span
                className="block h-5 w-5 rounded-ficha"
                style={{
                  backgroundColor: COLORWAYS[id].token,
                  boxShadow:
                    'inset 0 1px 0 rgb(255 255 255 / 0.13), inset 0 -3px 6px rgb(0 0 0 / 0.34)',
                }}
              />
              <span className="sr-only">{COLORWAYS[id].nombre}</span>
            </li>
          ))}
        </ul>
        <span className="text-nota text-grafia-suave">{producto.colorways.length} pieles</span>
      </div>
    </article>
  )
}
