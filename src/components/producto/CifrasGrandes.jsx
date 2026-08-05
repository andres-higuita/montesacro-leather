import BloqueEncendido from '../BloqueEncendido'

/**
 * Las medidas, al tamaño que se merecen.
 *
 * En MONTESACRO la cifra ES el argumento (ver PRODUCT.md, principio 1). Aquí no
 * acompaña al texto: lo sustituye. Cada dato se parte en número y unidad —el
 * número a cuerpo de portada, la unidad pequeña al lado— para que la fila se
 * lea de un vistazo sin convertirse en una tabla.
 *
 * Se encienden de uno en uno al subir, con la misma curva medida que el resto
 * del sitio. Ver BloqueEncendido.
 */

/** Parte «25.5 cm» en ['25.5', 'cm']. Sin unidad, devuelve el valor entero. */
function partir(valor) {
  const encaje = String(valor).match(/^([\d.,]+)\s*(.*)$/)
  return encaje ? [encaje[1], encaje[2]] : [String(valor), '']
}

export default function CifrasGrandes({ producto, codigo, id }) {
  const cifras = [
    ...producto.specs.medidas,
    ['Peso', producto.peso],
    ['Pieles', `${producto.colorways.length}`],
    ['Referencia', codigo],
  ]

  return (
    <section id={id} className="bg-black py-[clamp(4rem,10vw,8rem)]">
      <div className="canal">
        <p className="versalita text-nota text-oro">En cifras</p>
        <h2 className="mt-6 max-w-[20ch] font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
          Todo lo que define la pieza, medido
        </h2>

        <dl className="mt-[clamp(2.5rem,6vw,4rem)] grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {cifras.map(([clave, valor]) => {
            const [numero, unidad] = partir(valor)
            // La referencia no es una cifra: a cuerpo de portada se parte en dos
            // líneas y desordena la retícula. Solo los números crecen.
            const esCifra = /^[\d.,]/.test(numero)

            return (
              <BloqueEncendido key={clave} className="border-t border-oro/34 pt-6">
                <dt className="versalita text-nota text-humo">{clave}</dt>
                <dd className="mt-3 flex items-baseline gap-2.5">
                  <span
                    className={`troquel leading-none text-marfil ${
                      esCifra ? 'text-portada' : 'text-mayor'
                    }`}
                  >
                    {numero}
                  </span>
                  {unidad && <span className="text-menor text-humo">{unidad}</span>}
                </dd>
              </BloqueEncendido>
            )
          })}
        </dl>

        <p className="mt-12 max-w-[54ch] text-nota leading-relaxed text-humo">
          Las cifras son nominales. La piel es material natural: entre dos piezas del
          mismo modelo hay variaciones de milímetros, y ninguna es un defecto.
        </p>
      </div>
    </section>
  )
}
