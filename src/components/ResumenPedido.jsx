import { COLORWAYS } from '../data/productos'
import { IMG_PRODUCTO, juegoDeFotos } from '../data/imagenes'
import Rombo from './Rombo'

/**
 * Ficha del pedido. Vive en mundo contrario porque un pedido ES un documento,
 * igual que las specs y la tarjeta de autenticidad.
 *
 * No muestra totales: el prototipo no tiene precios reales y una suma
 * inventada sería lo único de esta pantalla que mentiría.
 */
export default function ResumenPedido({ lineas, piezas, className = '', compacto = false }) {
  return (
    <aside className={`mundo-contra border filete p-7 ${className}`} aria-label="Resumen del pedido">
      <h2 className="versalita text-nota text-acento">Su pedido</h2>

      <ul className="mt-6 space-y-6">
        {lineas.map((linea, i) => {
          const cw = COLORWAYS[linea.colorway]
          const imagen = IMG_PRODUCTO[linea.productoId]?.colorways?.[linea.colorway]

          return (
            <li key={`${linea.codigo}-${i}`} className="flex gap-4">
              {imagen && !compacto && (
                <img
                  src={juegoDeFotos(imagen.id, [120, 200, 280]).src}
                  alt=""
                  className="h-20 w-16 shrink-0 object-cover"
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="flex items-baseline justify-between gap-4 text-menor text-grafia">
                  <span>{linea.nombre}</span>
                  <span className="troquel shrink-0 text-nota text-grafia-suave">
                    ×{linea.cantidad}
                  </span>
                </p>
                <p className="mt-1.5 flex items-center gap-2.5 text-nota text-grafia-suave">
                  <span
                    aria-hidden="true"
                    className="block h-2.5 w-2.5 rounded-[1px]"
                    style={{ backgroundColor: cw?.token }}
                  />
                  {cw?.nombre}
                </p>
                {linea.iniciales && (
                  <p className="mt-1 text-nota text-grafia-suave">
                    Placa grabada · {linea.iniciales}
                  </p>
                )}
                <p className="troquel mt-1 text-nota text-grafia-suave">{linea.codigo}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <dl className="mt-8 border-t filete pt-5 text-menor">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-grafia-suave">Piezas</dt>
          <dd className="troquel text-grafia">{piezas}</dd>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <dt className="text-grafia-suave">Total</dt>
          <dd className="troquel text-grafia">Bajo consulta</dd>
        </div>
      </dl>

      <ul className="mt-7 space-y-2.5 border-t filete pt-5">
        {[
          'Certificado de autenticidad numerado',
          'Caja rígida, bolsa de algodón y bolsa de compra',
          'Preparación a pedido: 3 a 5 semanas',
        ].map((linea) => (
          <li key={linea} className="flex items-start gap-3 text-nota text-grafia-suave">
            <Rombo size={4} className="mt-1.5 shrink-0 text-acento" />
            {linea}
          </li>
        ))}
      </ul>
    </aside>
  )
}
