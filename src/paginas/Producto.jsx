import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarProducto, codigoDeProducto, COLORWAYS, PRODUCTOS } from '../data/productos'
import { BODEGON, escenaDe } from '../data/escenas'
import { IMG } from '../data/imagenes'
import { useCarrito } from '../carrito/contexto'
import PortadaPieza from '../components/producto/PortadaPieza'
import BarraPieza from '../components/producto/BarraPieza'
import RecorridoScrub from '../components/producto/RecorridoScrub'
import DestellosPieza from '../components/producto/DestellosPieza'
import PanelPieles from '../components/producto/PanelPieles'
import CifrasGrandes from '../components/producto/CifrasGrandes'
import ConfiguraPieza from '../components/producto/ConfiguraPieza'
import FichaTecnica from '../components/FichaTecnica'
import TarjetaPieza from '../components/TarjetaPieza'
import TextoIluminado from '../components/TextoIluminado'
import Bloque from '../components/Bloque'
import Foto from '../components/Foto'

/**
 * Ficha de pieza.
 *
 * No es una ficha de catálogo con fotos y un botón: es un recorrido, y el
 * orden importa. Primero la pieza a pantalla completa, después el argumento,
 * después la fabricación ligada al scroll, y solo al final la compra. Quien ya
 * decidió no tiene que recorrerlo entero — la barra fijada lleva el botón de
 * añadir desde que termina la portada.
 *
 *   portada → manifiesto → recorrido fijado → detalles → pieles → cifras
 *   → la placa interior → ficha técnica → configurar → las otras piezas
 *
 * Todo el recorrido va sobre negro salvo la ficha técnica, que cae en el mundo
 * papel. Es la alternancia piel/papel del collection book: el dato vive en el
 * papel, la pieza en la piel.
 *
 * El guion de cada pieza —metraje, capítulos y frases— vive en
 * `src/data/escenas.js`. Aquí no hay una sola cadena de copy de producto.
 */
export default function Producto() {
  const { slug } = useParams()
  const producto = buscarProducto(slug)
  const escena = escenaDe(producto?.id)
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

  if (!producto || !escena) {
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
      <PortadaPieza producto={producto} escena={escena} precio={producto.precioDesde} />

      <BarraPieza
        producto={producto}
        precio={producto.precioDesde}
        codigo={codigo}
        alAnadir={alAnadir}
      />

      {/* ── El argumento de la pieza ──────────────────────────────────
          Única frase larga de la ficha, y la única que se enciende palabra
          por palabra. El ritmo de lectura lo pone el visitante. */}
      <section className="relative z-[var(--z-base)] bg-black py-[clamp(5rem,11vw,9rem)]">
        <div className="canal">
          <TextoIluminado className="mx-auto max-w-[24ch] text-center font-[family-name:var(--font-display)] text-portada leading-[1.1] text-marfil">
            {escena.manifiesto}
          </TextoIluminado>
        </div>
      </section>

      {/* ── El recorrido: la pieza, fotograma a fotograma ─────────────
          Es el bloque con movimiento de la ficha. Funciona porque todo lo que
          viene después está quieto. */}
      <RecorridoScrub
        id="recorrido"
        secuencia={escena.secuencia}
        capitulos={escena.capitulos}
        alt={escena.alt}
        // El recorrido dura según los fotogramas que tenga la pieza. Repartir
        // un tramo corto en cuatro pantallas lo deja avanzando a saltos, y uno
        // largo en dos, a tirones. Catorce fotogramas por pantalla es el ritmo
        // al que el arrastre se lee continuo en las piezas del metraje maestro.
        // La pieza que tiene metraje propio lo fija a mano en escenas.js: con
        // secuencias largas la fórmula se queda corta de densidad.
        recorrido={escena.recorrido ?? Math.min(4, Math.max(2.4, escena.secuencia.total / 14))}
        // La pieza con metraje propio se dibuja como placa: el plano es 720p y a
        // sangre, en una pantalla retina, habría que ampliarlo tres veces.
        anchoPlaca={escena.anchoPlaca}
        nitidez={escena.nitidez}
      />

      <DestellosPieza producto={producto} destellos={escena.destellos} />

      <PanelPieles
        id="pieles"
        producto={producto}
        colorway={colorway}
        alCambiar={setPielElegida}
        copy={escena.pieles}
      />

      <CifrasGrandes producto={producto} codigo={codigo} />

      {/* ── La placa interior ─────────────────────────────────────────
          La fotografía se fija y el texto pasa a su lado. Mismo mecanismo que
          la portada de inicio: sin fundidos ni parallax. */}
      <section className="border-t border-marfil/10 bg-black">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center px-[var(--medida-canal)] py-[clamp(4rem,9vw,7rem)] lg:px-[clamp(2.5rem,5vw,5rem)]">
            <Bloque className="w-full max-w-[36rem]">
              <p className="versalita text-nota text-oro">La segunda aparición</p>
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
                La marca solo la ve quien la usa
              </h2>
              <p className="mt-7 max-w-[46ch] text-menor leading-relaxed text-humo">
                Dentro de la pieza, cosida al forro, va la placa con el monograma. Es el
                único lugar del {producto.nombre.toLowerCase()} donde el nombre de la casa
                queda escrito. Por fuera no hay logo: el cierre metálico es la primera
                aparición, y esta es la segunda.
              </p>
              <a
                href="#configurar"
                className="versalita mt-9 inline-block border-b border-oro pb-1.5 text-menor text-marfil transition-colors duration-400 hover:text-oro"
              >
                Grabar iniciales en la placa
              </a>
            </Bloque>
          </div>

          <div className="lg:sticky lg:top-0 lg:h-svh">
            <Foto
              imagen={IMG.placa}
              ratio="4 / 3"
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* ── Ficha técnica, en mundo papel ─────────────────────────────── */}
      <section id="ficha" className="mundo-contra py-[clamp(4.5rem,10vw,8rem)]">
        <div className="canal">
          <Bloque>
            <h2 className="text-titulo text-grafia">Ficha técnica</h2>
            <p className="prosa mt-5 text-grafia-suave">
              El detalle completo de la pieza en la piel elegida. Las cifras son
              nominales; la piel, al ser natural, admite variaciones de milímetros.
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

      <ConfiguraPieza
        id="configurar"
        producto={producto}
        colorway={colorway}
        alCambiarPiel={setPielElegida}
        codigo={codigo}
        precio={producto.precioDesde}
        placaActiva={placaActiva}
        alAlternarPlaca={setPlacaActiva}
        uno={uno}
        dos={dos}
        alCambiarUno={setUno}
        alCambiarDos={setDos}
        alAnadir={alAnadir}
      />

      {/* ── Las otras piezas, sobre el bodegón de las tres ────────────── */}
      <section className="relative overflow-hidden bg-black py-[clamp(5rem,11vw,9rem)]">
        {/* El bodegón va de fondo, quieto y en bucle: es el mismo plano final
            del metraje maestro, sin corte visible al repetirse. */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={BODEGON.poster}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        >
          <source src={BODEGON.video} type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"
        />

        <div className="canal relative">
          <Bloque>
            <p className="versalita text-nota text-oro">La casa</p>
            <h2 className="mt-6 max-w-[18ch] font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
              Las otras dos piezas
            </h2>
          </Bloque>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {otras.map((p) => (
              <TarjetaPieza key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
