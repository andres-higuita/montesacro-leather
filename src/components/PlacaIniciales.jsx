/**
 * Vista previa de la placa de cuero grabada.
 *
 * Reproduce la pieza del collection book: 5.0 × 2.0 cm, cuero genuino, bordes
 * pintados y pulidos a mano, iniciales en dorado separadas por una barra.
 * La usa tanto la ficha de producto como la página de la experiencia.
 */
export default function PlacaIniciales({ uno, dos, tamano = 'grande', className = '' }) {
  const compacta = tamano === 'compacta'

  return (
    <div
      className={`mundo-cuero relative flex items-center justify-center ${
        compacta ? 'max-w-[13rem] rounded-[6px] px-6' : 'max-w-[26rem] rounded-[10px] px-10'
      } w-full ${className}`}
      style={{
        aspectRatio: '5 / 2',
        backgroundColor: 'var(--color-cw-cafe)',
        boxShadow: 'inset 0 2px 0 rgb(255 255 255 / 0.1), inset 0 -14px 26px rgb(0 0 0 / 0.42)',
      }}
    >
      {/* Pespunte perimetral, como en la placa física */}
      <span
        aria-hidden="true"
        className={`absolute rounded-[4px] border border-dashed ${
          compacta ? 'inset-[6px]' : 'inset-[9px] rounded-[6px]'
        }`}
        style={{ borderColor: 'rgb(255 255 255 / 0.22)' }}
      />

      <p
        className={`relative flex items-center leading-none text-acento ${
          compacta ? 'gap-3 text-mayor' : 'gap-5 text-portada'
        } font-[family-name:var(--font-display)]`}
      >
        <span className="w-[1.1em] text-center">{uno || '—'}</span>
        <span className="text-[0.8em] opacity-45">|</span>
        <span className="w-[1.1em] text-center">{dos || '—'}</span>
      </p>
    </div>
  )
}
