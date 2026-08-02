import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarProducto, codigoDeProducto, COLORWAYS, PRODUCTOS } from '../data/productos'
import { IMG } from '../data/imagenes'
import { useCarrito } from '../carrito/contexto'
import GaleriaProducto from '../components/GaleriaProducto'
import SelectorColor from '../components/SelectorColor'
import FichaTecnica from '../components/FichaTecnica'
import PersonalizacionCompacta from '../components/PersonalizacionCompacta'
import TarjetaPieza from '../components/TarjetaPieza'
import Bloque from '../components/Bloque'
import Foto from '../components/Foto'
import Rombo from '../components/Rombo'
import { MonogramaEnrombo } from '../components/Monograma'

export default function Producto() {
  const { slug } = useParams()
  const producto = buscarProducto(slug)
  const { agregar } = useCarrito()

  const [pielElegida, setPielElegida] = useState(null)
  const [placaActiva, setPlacaActiva] = useState(false)
  const [uno, setUno] = useState('A')
  const [dos, setDos] = useState('B')

  // Derivado, no sincronizado con un efecto: al saltar de una pieza a otra la
  // piel elegida deja de existir y la ficha cae en la primera de la nueva carta.
  const colorway =
    producto && producto.colorways.includes(pielElegida)
      ? pielElegida
      : producto?.colorways[0]

  if (!producto) {
    return (
      <section className="canal flex min-h-[70svh] flex-col justify-center py-32">
        <h1 className="text-titulo text-grafia">Esa pieza no está en el catálogo</h1>
        <Link
          to="/catalogo"
          className="versalita mt-8 self-start border-b border-acento pb-1.5 text-menor text-grafia"
        >
          Ver las tres piezas
        </Link>
      </section>
    )
  }

  const otras = PRODUCTOS.filter((p) => p.id !== producto.id)
  const codigo = codigoDeProducto(producto, colorway)
  const iniciales = placaActiva && (uno || dos) ? `${uno || '—'} | ${dos || '—'}` : null

  const alAnadir = () =>
    agregar({
      productoId: producto.id,
      nombre: producto.nombre,
      colorway,
      codigo,
      iniciales,
    })

  return (
    <>
      {/* ── Galería + columna de compra ───────────────────────────────── */}
      <section className="canal pt-[clamp(7rem,13vw,10rem)] pb-[clamp(4rem,9vw,7rem)]">
        <nav aria-label="Ruta" className="mb-10 text-nota text-grafia-suave">
          <Link to="/catalogo" className="vinculo">
            Las piezas
          </Link>
          <span className="mx-3 opacity-70" aria-hidden="true">/</span>
          <span className="text-grafia/85">{producto.nombre}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-[6.5rem] lg:self-start">
            <GaleriaProducto productoId={producto.id} colorway={colorway} />
          </div>

          <div>
            <p className="versalita text-nota text-acento">{producto.familia}</p>
            <h1 className="mt-4 text-portada text-grafia">{producto.nombre}</h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-7 gap-y-2">
              <p className="troquel text-mayor text-grafia">{producto.precioDesde}</p>
              <p className="troquel text-nota text-grafia-suave" aria-live="polite">
                Ref. {codigo}
              </p>
            </div>

            <p className="prosa mt-7 text-grafia-suave">{producto.esencia}</p>

            <SelectorColor
              className="mt-12"
              colorways={producto.colorways}
              activo={colorway}
              alCambiar={setPielElegida}
            />

            {/* Medidas rápidas, antes de la ficha completa */}
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-5 border-t filete pt-7">
              {[...producto.specs.medidas, ['Peso', producto.peso]].map(([clave, valor]) => (
                <div key={clave}>
                  <dt className="text-nota text-grafia-suave">{clave}</dt>
                  <dd className="troquel mt-1.5 text-mayor text-grafia">{valor}</dd>
                </div>
              ))}
            </dl>

            <PersonalizacionCompacta
              className="mt-12 border-t filete pt-9"
              activa={placaActiva}
              alAlternar={setPlacaActiva}
              uno={uno}
              dos={dos}
              alCambiarUno={setUno}
              alCambiarDos={setDos}
            />

            <button
              type="button"
              onClick={alAnadir}
              className="versalita mt-11 w-full border border-acento px-8 py-4.5 text-menor text-grafia transition-colors duration-500 hover:bg-realce"
            >
              Añadir al carrito
            </button>

            <p className="mt-4 text-nota leading-relaxed text-grafia-suave">
              Prototipo de diseño: el pedido se puede recorrer completo, pero no se procesa
              ningún pago y los precios son marcadores de posición.
            </p>

            {/* Certificado y empaque */}
            <div className="mt-12 flex gap-6 border-t filete pt-9">
              <MonogramaEnrombo size={44} className="mt-0.5 shrink-0 text-acento" />
              <div>
                <p className="text-menor text-grafia">
                  Incluye certificado de autenticidad numerado
                </p>
                <p className="mt-2 text-nota leading-relaxed text-grafia-suave">
                  Cartulina de algodón de 700 g/m², impresa en letterpress, con un número
                  de serie único que queda en el registro de la casa.{' '}
                  <Link to="/experiencia#autenticidad" className="vinculo text-grafia/85">
                    Cómo funciona
                  </Link>
                </p>
              </div>
            </div>

            <ul className="mt-9 space-y-3">
              {producto.empaque.map((linea) => (
                <li key={linea} className="flex items-center gap-3.5 text-menor text-grafia-suave">
                  <Rombo size={5} className="text-acento" />
                  {linea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Ficha técnica, en mundo papel ─────────────────────────────── */}
      <section className="mundo-contra py-[clamp(4.5rem,10vw,8rem)]">
        <div className="canal">
          <Bloque>
            <h2 className="text-titulo text-grafia">Ficha técnica</h2>
            <p className="prosa mt-5 text-grafia-suave">
              Todo lo que define la pieza, medido. Las cifras son nominales; la piel, al
              ser natural, admite variaciones de milímetros.
            </p>
          </Bloque>

          <Bloque className="mt-[clamp(2.5rem,5vw,4rem)]">
            <FichaTecnica
              grupos={[
                { titulo: 'Medidas', filas: producto.specs.medidas },
                { titulo: 'Materiales', filas: producto.specs.materiales },
                { titulo: 'Herrajes', filas: producto.specs.herrajes },
                {
                  titulo: 'Identificación',
                  filas: [
                    ['Código', codigo],
                    ['Piel', COLORWAYS[colorway].nombre],
                    ['Peso', producto.peso],
                    ['Certificado', 'Serie numerada única'],
                  ],
                },
              ]}
            />
          </Bloque>
        </div>
      </section>

      {/* ── El cierre en esta pieza ───────────────────────────────────── */}
      <section className="border-t border-grafia/10">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center px-[var(--medida-canal)] py-[clamp(4rem,9vw,7rem)]">
            <Bloque className="w-full max-w-[36rem]">
              <h2 className="text-titulo text-grafia">La segunda aparición</h2>
              <p className="prosa mt-7 text-grafia-suave">
                Dentro de la pieza, cosida al forro, va la placa con el monograma. Es el
                único lugar del {producto.nombre.toLowerCase()} donde el nombre de la casa
                queda escrito, y solo lo ve quien la usa.
              </p>
              <Link
                to="/experiencia"
                className="versalita mt-9 inline-block border-b border-acento pb-1.5 text-menor text-grafia transition-colors duration-400 hover:text-acento"
              >
                Cómo llega a sus manos
              </Link>
            </Bloque>
          </div>

          <Foto
            imagen={IMG.herraje}
            ratio="4 / 3"
            sizes="(min-width: 64rem) 50vw, 100vw"
            className="lg:h-full"
          />
        </div>
      </section>

      {/* ── Las otras piezas ──────────────────────────────────────────── */}
      <section className="canal py-[clamp(5rem,11vw,9rem)]">
        <Bloque>
          <h2 className="text-mayor text-grafia">Las otras piezas</h2>
        </Bloque>
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {otras.map((p) => (
            <TarjetaPieza key={p.id} producto={p} />
          ))}
        </div>
      </section>
    </>
  )
}
