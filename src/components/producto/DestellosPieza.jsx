import BloqueEncendido from '../BloqueEncendido'
import Foto from '../Foto'
import { IMG, IMG_PRODUCTO } from '../../data/imagenes'

/**
 * Tres detalles de la pieza, en fila.
 *
 * Es el respiro entre el manifiesto y el recorrido fijado: bloques cortos, sin
 * movimiento propio más allá del encendido al subir. Va ANTES del recorrido
 * porque el recorrido y el selector de pieles tienen que quedar pegados —la
 * película enseña las cuatro y las fichas dejan escoger—, y meter algo entre
 * los dos rompía esa relación.
 *
 * Las tomas salen de la galería de la pieza; la tercera cae en el herraje, que
 * es común a las tres piezas de la casa.
 */
export default function DestellosPieza({ producto, destellos }) {
  const galeria = IMG_PRODUCTO[producto.id]?.galeria ?? []
  const tomas = [galeria[0], galeria[1], IMG.herraje]

  return (
    <section className="bg-black pb-[clamp(4rem,10vw,8rem)]">
      <div className="canal">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-3">
          {destellos.map((destello, i) => (
            <BloqueEncendido key={destello.titulo} as="article">
              {tomas[i] && (
                <Foto
                  imagen={tomas[i]}
                  ratio="4 / 5"
                  sizes="(min-width: 64rem) 30vw, 100vw"
                  anchos={[500, 800, 1100]}
                />
              )}
              <h3 className="mt-7 font-[family-name:var(--font-display)] text-mayor leading-[1.12] text-marfil">
                {destello.titulo}
              </h3>
              <p className="mt-3.5 max-w-[38ch] text-menor leading-relaxed text-humo">
                {destello.texto}
              </p>
            </BloqueEncendido>
          ))}
        </div>
      </div>
    </section>
  )
}
