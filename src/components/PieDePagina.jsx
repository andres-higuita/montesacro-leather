import { Link } from 'react-router-dom'
import Logotipo from './Logotipo'
import Rombo from './Rombo'
import InterruptorTema from './InterruptorTema'
import { PRODUCTOS } from '../data/productos'

/** Divisa del pie del collection book. */
const DIVISA = ['Permanencia', 'Tradición', 'Poder silencioso', 'Exclusividad', 'Artesanía']

export default function PieDePagina() {
  return (
    <footer className="mundo-vino">
      <div className="canal grid gap-14 py-20 md:grid-cols-[1.2fr_1fr_1fr] md:gap-10 md:py-24">
        <div>
          <Link to="/" className="inline-block text-grafia">
            <Logotipo tamano="pie" />
          </Link>
          <p className="prosa mt-8 text-menor leading-relaxed text-grafia/70">
            Marroquinería en piel exótica. Cada pieza se corta, se cose y se pule a mano, y
            sale de la casa con su número de serie.
          </p>
        </div>

        <nav aria-label="Las piezas">
          <h2 className="versalita text-nota text-acento">Las piezas</h2>
          <ul className="mt-5 space-y-3">
            {PRODUCTOS.map((p) => (
              <li key={p.id}>
                <Link to={`/producto/${p.slug}`} className="vinculo text-menor text-grafia/80">
                  {p.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="La casa">
          <h2 className="versalita text-nota text-acento">La casa</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <Link to="/experiencia" className="vinculo text-menor text-grafia/80">
                La experiencia Montesacro
              </Link>
            </li>
            <li>
              <Link
                to="/experiencia#personalizacion"
                className="vinculo text-menor text-grafia/80"
              >
                Personalización con iniciales
              </Link>
            </li>
            <li>
              <Link to="/experiencia#autenticidad" className="vinculo text-menor text-grafia/80">
                Tarjeta de autenticidad
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Banda de divisa — reproduce el pie del collection book */}
      <div className="border-t border-grafia/12">
        <ul className="canal flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-5 text-acento">
          {DIVISA.map((palabra, i) => (
            <li key={palabra} className="flex items-center gap-5">
              <span className="versalita text-nota">{palabra}</span>
              {i < DIVISA.length - 1 && <Rombo size={5} />}
            </li>
          ))}
        </ul>
      </div>

      {/* Banda de revisión. NO es parte del producto: vive aquí abajo, fuera
          del recorrido de compra, para no ensuciar el encabezado. Se borra
          entera cuando se elija la dirección visual (ver README). */}
      <div className="border-t border-grafia/12">
        <div className="canal flex flex-col items-start gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="versalita text-nota text-acento">Fondo del prototipo</p>
            <p className="mt-1.5 text-nota text-grafia/70">
              Para decidir la dirección visual. No es una preferencia del sitio.
            </p>
          </div>
          <InterruptorTema />
        </div>
      </div>

      <div className="border-t border-grafia/12">
        <div className="canal flex flex-col gap-2 py-6 text-nota text-grafia/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Montesacro Leather Goods</p>
          <p>Prototipo de dirección de diseño · precios de referencia, sin transacción</p>
        </div>
      </div>
    </footer>
  )
}
