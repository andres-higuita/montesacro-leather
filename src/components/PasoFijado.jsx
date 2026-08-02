import { juegoDeFotos } from '../data/imagenes'
import BloqueEncendido from './BloqueEncendido'

/**
 * Un paso del sistema de empaque, a pantalla partida con la fotografía fijada.
 *
 * La imagen se queda quieta ocupando media pantalla mientras el texto de su
 * paso recorre la otra mitad. Al terminar el paso, la imagen se despega y
 * entra la del siguiente. Encadenados, los cuatro pasos se leen como una sola
 * secuencia de apertura: de afuera hacia adentro.
 *
 * La foto va SIEMPRE a la izquierda. Alternar lados rompería la sensación de
 * secuencia y convertiría el bloque en una lista de bandas más.
 *
 * Es la única parte numerada del sitio, porque el empaque sí es un orden real.
 *
 * La fotografía no escala ni se funde: el fijado ES la animación. Añadirle un
 * acercamiento lento sonaba bien sobre el papel y en pantalla solo compite con
 * el pin, que es lo que de verdad sostiene la mirada.
 */
export default function PasoFijado({ elemento, imagen }) {
  const { src, srcSet } = juegoDeFotos(imagen.id, [800, 1200, 1600])

  return (
    <article className="relative grid gap-10 lg:grid-cols-2 lg:gap-0">
      {/* Sin `items-start`: la celda debe estirarse a la altura de la fila o
          el `sticky` no tiene recorrido y se queda quieto. */}
      {/* Fotografía fijada. En móvil no se fija: no hay espacio para partir. */}
      <div>
        <div className="h-[58svh] overflow-hidden bg-lienzo-alto lg:sticky lg:top-0 lg:h-svh">
          <img
            src={src}
            srcSet={srcSet}
            sizes="(min-width: 64rem) 50vw, 100vw"
            alt={imagen.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Texto del paso */}
      <div className="px-[var(--medida-canal)] lg:px-[clamp(2.5rem,5vw,5rem)]">
        {/* Más alta que la pantalla: esa diferencia es el recorrido del pin. */}
        <div className="w-full max-w-[34rem] space-y-14 py-[10svh] lg:space-y-[24svh] lg:py-[22svh]">
          {/* Cada trozo se enciende al llegar a la altura de la mirada. Ver
              BloqueEncendido: la curva está medida sobre MORAE. */}
          <BloqueEncendido>
            <p className="troquel text-menor text-acento">
              [{String(elemento.orden).padStart(2, '0')}]
            </p>

            <h3 className="mt-5 flex gap-4 text-titulo text-grafia">
              <span aria-hidden="true" className="text-acento">/</span>
              <span>{elemento.nombre}</span>
            </h3>
          </BloqueEncendido>

          <BloqueEncendido>
            <p className="prosa text-menor leading-relaxed text-grafia-suave">
              {elemento.entrada}
            </p>
          </BloqueEncendido>

          <BloqueEncendido as="dl">
            <div className="border-t filete">
              {elemento.specs.map(([clave, valor]) => (
                <div
                  key={clave}
                  className="flex items-baseline justify-between gap-6 border-b filete py-3"
                >
                  <dt className="shrink-0 text-nota text-grafia-suave">{clave}</dt>
                  <dd className="troquel text-right text-nota text-grafia">{valor}</dd>
                </div>
              ))}
            </div>
          </BloqueEncendido>
        </div>
      </div>
    </article>
  )
}
