/**
 * Monograma MS — el único logo del sitio.
 *
 * Aparece solo donde la pieza física lo lleva: cierre, placa interior, sello
 * de autenticidad y favicon. Nunca como adorno repetido (ver PRODUCT.md).
 *
 * Marcador de posición tipográfico: cuando exista el SVG vectorizado del
 * monograma caligráfico real, se sustituye el contenido de <svg> y nada más.
 */
export default function Monograma({ size = 28, className = '', tono = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Monograma MS de Montesacro"
      className={className}
    >
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fill={tono}
        fontFamily="Marcellus, 'Times New Roman', serif"
        fontSize="30"
        letterSpacing="-3.2"
      >
        MS
      </text>
    </svg>
  )
}

/** Monograma dentro del rombo de la marca. Se usa en el sello y en el pie. */
export function MonogramaEnrombo({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Monograma MS de Montesacro"
      className={className}
    >
      <path
        d="M32 3 61 32 32 61 3 32Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="Marcellus, 'Times New Roman', serif"
        fontSize="26"
        letterSpacing="-2.8"
      >
        MS
      </text>
    </svg>
  )
}
