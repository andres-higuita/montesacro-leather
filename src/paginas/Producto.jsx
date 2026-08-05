import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarProducto, codigoDeProducto, COLORWAYS } from '../data/productos'
import { escenaDe } from '../data/escenas'
import { useCarrito } from '../carrito/contexto'
import PortadaPieza from '../components/producto/PortadaPieza'
import BarraPieza from '../components/producto/BarraPieza'
import RecorridoScrub from '../components/producto/RecorridoScrub'
import DestellosPieza from '../components/producto/DestellosPieza'
import PanelPieles from '../components/producto/PanelPieles'
import ConfiguraPieza from '../components/producto/ConfiguraPieza'
import FichaTecnica from '../components/FichaTecnica'
import TextoIluminado from '../components/TextoIluminado'
import Bloque from '../components/Bloque'

/**
 * Ficha de pieza.
 *
 * No es una ficha de catálogo con fotos y un botón: es un recorrido, y el
 * orden importa. Primero la pieza a pantalla completa, después el argumento,
 * después la fabricación ligada al scroll, y solo al final la compra. Quien ya
 * decidió no tiene que recorrerlo entero — la barra fijada lleva el botón de
 * añadir desde que termina la portada.
 *
 *   portada → manifiesto → recorrido fijado → detalles → pieles
 *   → ficha técnica → configurar
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
          Ver el catálogo
        </Link>
      </section>
    )
  }

  const codigo = codigoDeProducto(producto, colorway)
  const iniciales = placaActiva && (uno || dos) ? `${uno || '—'} | ${dos || '—'}` : null

  // `cantidad` solo la manda la barra flotante, que lleva selector. El botón
  // del configurador llama sin argumento y añade una unidad.
  const alAnadir = (cantidad) =>
    agregar(
      {
        productoId: producto.id,
        nombre: producto.nombre,
        colorway,
        codigo,
        iniciales,
      },
      cantidad,
    )

  return (
    <>
      <PortadaPieza producto={producto} escena={escena} precio={producto.precioDesde} />

      <BarraPieza
        producto={producto}
        precio={producto.precioDesde}
        codigo={codigo}
        colorway={colorway}
        alCambiarPiel={setPielElegida}
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

      <DestellosPieza producto={producto} destellos={escena.destellos} />

      {/* ── El recorrido: la pieza, fotograma a fotograma ─────────────
          Es el bloque con movimiento de la ficha. Funciona porque todo lo que
          viene después está quieto.
          Va pegado al selector de pieles a propósito: la película recorre las
          cuatro y las fichas de abajo dejan elegir. Es el orden del visor de
          producto de Apple —enseñar las variantes y acto seguido poder
          escogerlas—, y separarlos con otro bloque rompía la relación. */}
      <RecorridoScrub
        id="recorrido"
        secuencia={escena.secuencia}
        // La pieza con metraje propio lo tiene rodado también en 9:16. En
        // teléfono manda esa toma: el 16:9 no llena una pantalla vertical.
        secuenciaVertical={escena.secuenciaVertical}
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

      <PanelPieles
        id="pieles"
        producto={producto}
        colorway={colorway}
        alCambiar={setPielElegida}
        copy={escena.pieles}
      />

      {/* Aquí iban «En cifras» y «La segunda aparición». Se quitaron a mano: la
          primera repetía en tipografía grande lo que la ficha técnica ya dice
          en tabla, y la segunda contaba la placa interior con una foto de
          archivo justo antes del bloque que deja grabarla. De pieles se pasa
          ahora directo a la ficha. */}

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

      {/* Aquí iba «Las otras dos piezas», sobre el bodegón del metraje maestro.
          Con una sola pieza en catálogo no hay otras que enseñar, así que la
          sección entera se retiró — junto con el clip del bodegón, que solo
          vivía aquí. Volverá sola el día que `PRODUCTOS` tenga más de una
          entrada; el código está en el historial. */}
    </>
  )
}
