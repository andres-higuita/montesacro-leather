import { Link } from 'react-router-dom'
import { PRODUCTOS } from '../../data/productos'
import Monograma from '../Monograma'

const PIEZA = PRODUCTOS[0]

/**
 * El cierre del recorrido.
 *
 * Una sola llamada, y va a la ficha en vez de resolver la compra aquí. La ficha
 * ya tiene el selector de piel, las iniciales y la cantidad; repetir ese
 * formulario en la portada obligaría a mantener dos veces la misma lógica y a
 * decidir cuál manda cuando se contradicen.
 *
 * Es también el único sitio de la portada donde aparece el monograma. La regla
 * la pone la pieza física: la marca sale dos veces, y pequeña. La web imita esa
 * regla en lugar de repetir un logo en cada banda.
 */
export default function Cierre() {
  return (
    <section
      id="pedido"
      aria-label="Encargar la pieza"
      className="relative bg-obsidiana py-[clamp(5rem,11vw,9rem)]"
    >
      <div className="canal flex flex-col items-center text-center">
        <Monograma size={40} tono="var(--color-acento)" />

        <h2 className="mt-9 max-w-[18ch] font-[family-name:var(--font-display)] text-portada leading-[1.08] text-marfil">
          Hecha por encargo, numerada al salir
        </h2>

        <p className="mt-7 max-w-[46ch] text-menor leading-relaxed text-humo">
          Se elige la piel y las iniciales de la placa. La pieza se fabrica después
          del pedido y sale con su tarjeta de autenticidad y su número de serie.
        </p>

        <p className="troquel mt-10 text-mayor text-marfil">{PIEZA.precioDesde}</p>
        <p className="versalita mt-2 text-nota text-humo">
          Entrega estimada 4 a 6 semanas
        </p>

        <Link
          to={`/producto/${PIEZA.slug}`}
          className="versalita mt-11 inline-block rounded-ficha bg-marfil px-10 py-4 text-menor text-obsidiana transition-colors duration-400 hover:bg-acento"
        >
          Configurar la pieza
        </Link>

        <p className="mt-8 max-w-[42ch] text-nota leading-relaxed text-humo/70">
          Prototipo de dirección de diseño. No procesa pagos ni envía datos a
          ningún servidor.
        </p>
      </div>
    </section>
  )
}
