import { PRODUCTOS } from '../../data/productos'

const PIEZA = PRODUCTOS[0]

/**
 * La ficha técnica: el bloque que NO se mueve.
 *
 * Va sobre marfil y es el único respiro claro del recorrido. Aquí el argumento
 * de venta son las medidas, así que la sección se comporta como lo que es —una
 * tabla— y se lee de una vez. Cualquier movimiento aquí trabajaría en contra:
 * un dato que entra fundiéndose se lee como publicidad, y uno que simplemente
 * está se lee como certificado.
 */
export default function Ficha() {
  const grupos = [
    ['Medidas', PIEZA.specs.medidas],
    ['Materiales', PIEZA.specs.materiales],
    ['Herrajes', PIEZA.specs.herrajes],
  ]

  return (
    <section
      id="ficha"
      aria-label="Ficha técnica"
      className="mundo-contra relative bg-marfil py-[clamp(4rem,9vw,7rem)]"
    >
      <div className="canal">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="versalita text-nota text-oro-hondo">06 / Ficha técnica</p>
            <h2 className="mt-5 max-w-[18ch] font-[family-name:var(--font-display)] text-portada leading-[1.08] text-tinta">
              Todo lo que se puede medir
            </h2>
          </div>

          <p className="troquel text-nota text-tinta-suave">
            {PIEZA.codigo} · {PIEZA.peso}
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,6vw,4rem)] grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {grupos.map(([titulo, filas]) => (
            <div key={titulo}>
              <h3 className="versalita text-nota text-oro-hondo">{titulo}</h3>

              <dl className="mt-5 border-t border-oro-hondo/30">
                {filas.map(([clave, valor]) => (
                  <div
                    key={clave}
                    className="flex items-baseline justify-between gap-6 border-b border-oro-hondo/30 py-3.5"
                  >
                    <dt className="shrink-0 text-nota text-tinta-suave">{clave}</dt>
                    <dd className="troquel max-w-[22ch] text-right text-nota text-tinta">
                      {valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-[clamp(2.5rem,5vw,3.5rem)] max-w-[62ch] text-nota leading-relaxed text-tinta-suave">
          Herrajes, empaque y gramajes son literales del manual de la casa. Las
          medidas de la pieza, el peso y el código están pendientes de confirmar
          con producción.
        </p>
      </div>
    </section>
  )
}
