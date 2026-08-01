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
              <div
                key={clave}
                className="flex items-baseline justify-between gap-6 border-b filete py-3"
              >
                <dt className="shrink-0 text-menor text-grafia-suave">{clave}</dt>
                <dd className="troquel text-right text-menor text-grafia">{valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
