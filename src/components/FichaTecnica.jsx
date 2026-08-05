/**
 * Ficha técnica en mundo papel.
 *
 * En MONTESACRO la especificidad ES el argumento de venta (ver PRODUCT.md,
 * principio 1): donde otra marca pondría copy emotivo, aquí va un dato.
 * Por eso las cifras van en `troquel` — numeración tabular, tracking abierto.
 */
export default function FichaTecnica({ grupos, className = '' }) {
  return (
    <div className={`grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {grupos.map(({ titulo, filas }) => (
        <section key={titulo}>
          <h3 className="versalita border-b filete pb-3 text-nota text-acento">
            {titulo}
          </h3>

          <dl className="mt-5">
            {filas.map(([clave, valor]) => (
              /* Etiqueta y dato en la misma línea mientras el dato sea corto.
                 En teléfono, un valor como «Piel con relieve de caimán, curtida
                 al vegetal» se partía en tres líneas alineadas a la derecha,
                 con la etiqueta colgando arriba: se leía como un poema, no como
                 una tabla. Bajo `sm` la fila se apila y todo va a la izquierda. */
              <div key={clave} className="border-b filete py-3 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="text-menor text-grafia-suave sm:shrink-0">{clave}</dt>
                <dd className="troquel mt-1 text-menor text-grafia sm:mt-0 sm:text-right">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
