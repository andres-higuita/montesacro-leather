import { MonogramaEnrombo } from './Monograma'

/**
 * Tarjeta de autenticidad. Reproduce la pieza física: cartulina de algodón
 * 700 g/m², 8.5 × 5.5 cm, letterpress y hot stamping dorado, número de serie
 * único por pieza.
 */
export default function SelloAutenticidad({ serie = '000123', className = '' }) {
  return (
    // La proporción real de la tarjeta (8.5 × 5.5 cm) solo se impone desde sm:
    // por debajo de ese ancho el texto no cabe y desbordaría el recuadro.
    <div
      className={`flex flex-col items-center border filete bg-lienzo-alto px-8 py-9 text-center sm:aspect-[85/55] ${className}`}
    >
      <MonogramaEnrombo size={46} className="text-acento" />

      <p className="versalita mt-4 text-nota text-acento">Certificado de autenticidad</p>

      <p className="prosa mt-3 max-w-[30ch] text-nota leading-relaxed text-grafia/70">
        Esta pieza ha sido elaborada con los más altos estándares de calidad y con pieles
        seleccionadas cuidadosamente.
      </p>

      <p className="troquel mt-auto pt-4 text-menor text-grafia">
        N° {serie}
      </p>
    </div>
  )
}
