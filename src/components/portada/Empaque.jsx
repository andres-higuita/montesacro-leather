import { EMPAQUE } from '../../data/productos'

/**
 * El empaque: los cuatro elementos, de afuera hacia adentro.
 *
 * Es la ÚNICA secuencia numerada del sitio, y lo es porque el orden existe de
 * verdad: la bolsa de compra contiene la caja, la caja contiene la bolsa de
 * algodón, y dentro está la tarjeta con el número de serie. Numerar cualquier
 * otra cosa del recorrido gastaría el recurso.
 *
 * Sin fotografía. Las tomas del empaque que había eran marcadores de posición
 * de banco de imágenes —una caja cualquiera, una bolsa cualquiera—, y en una
 * sección cuyo argumento es «esto está hecho a medida» una foto genérica dice
 * lo contrario del texto que tiene al lado. Las cifras solas son más honestas
 * hasta que exista la fotografía real de estudio.
 */
export default function Empaque() {
  return (
    <section
      id="empaque"
      aria-label="El empaque"
      className="relative bg-bosque-hondo py-[clamp(4rem,9vw,7rem)]"
    >
      <div className="canal">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="versalita text-nota text-marfil/55">07 / El sistema</p>
            <h2 className="mt-5 max-w-[16ch] font-[family-name:var(--font-display)] text-portada leading-[1.08] text-marfil">
              La caja también es la pieza
            </h2>
          </div>

          <p className="max-w-[40ch] text-menor leading-relaxed text-marfil/70">
            Cuatro elementos diseñados a la medida de cada producto. El diferenciador
            de la casa no es el bolso solo: es lo que llega con él.
          </p>
        </div>

        <ol className="mt-[clamp(2.5rem,6vw,4rem)] grid gap-px overflow-hidden rounded-ficha border border-marfil/15 bg-marfil/15 sm:grid-cols-2 lg:grid-cols-4">
          {EMPAQUE.map((elemento) => (
            <li key={elemento.id} className="flex flex-col bg-bosque-hondo p-[clamp(1.25rem,2.5vw,1.75rem)]">
              <p className="troquel text-nota text-marfil/45">
                0{elemento.orden}
              </p>

              <h3 className="mt-4 font-[family-name:var(--font-display)] text-mayor leading-tight text-marfil">
                {elemento.nombre}
              </h3>

              <p className="mt-4 text-nota leading-relaxed text-marfil/65">
                {elemento.entrada}
              </p>

              {/* Solo las tres primeras filas de cada ficha. La lista completa
                  vive en el manual: aquí la sección tiene que dar el peso del
                  sistema, no agotarlo. */}
              <dl className="mt-6 border-t border-marfil/15">
                {elemento.specs.slice(0, 3).map(([clave, valor]) => (
                  <div key={clave} className="border-b border-marfil/15 py-2.5">
                    <dt className="text-nota text-marfil/45">{clave}</dt>
                    <dd className="troquel mt-1 text-nota text-marfil/90">{valor}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
