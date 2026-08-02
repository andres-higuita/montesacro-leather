/**
 * Dibujo del tarjetero abriéndose. MARCADOR DE POSICIÓN.
 *
 * Existe para validar el ritmo del scroll antes de tener los fotogramas
 * reales. No pretende ser fotorrealista: es un volumen limpio, con la paleta
 * y los cantos de la marca, que se abre igual que se abrirá el metraje real.
 *
 * En cuanto `SECUENCIA_APERTURA.total > 0`, este archivo deja de usarse y se
 * puede borrar (ver `src/data/imagenes.js`).
 *
 * El canvas se deja transparente a propósito: el fondo lo pone el CSS, así el
 * dibujo funciona igual en el tema arcilla y en el tema piel.
 */

const PIEL = '#4A1B1F'
const PIEL_SOMBRA = '#351011'
const FORRO = '#EFE9DC'
const FORRO_SOMBRA = '#DCD2C0'
const ORO = '#B2945C'

/** Semiancho del volumen a una profundidad dada. t = 0 al fondo, 1 al frente. */
const semiancho = (ancho, t) => (ancho / 2) * (0.84 + 0.16 * t)

function cuadrilatero(ctx, cx, yBisagra, ancho, profundidad, tDesde, tHasta) {
  const y = (t) => yBisagra + profundidad * t
  const sa = (t) => semiancho(ancho, Math.max(t, -0.6))

  ctx.beginPath()
  ctx.moveTo(cx - sa(tDesde), y(tDesde))
  ctx.lineTo(cx + sa(tDesde), y(tDesde))
  ctx.lineTo(cx + sa(tHasta), y(tHasta))
  ctx.lineTo(cx - sa(tHasta), y(tHasta))
  ctx.closePath()
}

/** Pespunte perimetral, el mismo detalle que lleva la placa de cuero. */
function pespunte(ctx, color, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.setLineDash([4, 5])
  ctx.stroke()
  ctx.restore()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} ancho  ancho del canvas en px CSS
 * @param {number} alto   alto del canvas en px CSS
 * @param {number} p      progreso de apertura, 0 (cerrado) a 1 (abierto)
 */
export default function dibujarTarjetero(ctx, ancho, alto, p) {
  ctx.clearRect(0, 0, ancho, alto)

  const W = Math.min(ancho * 0.56, 640)
  const D = W * 0.66
  const cx = ancho / 2
  // Al abrirse crece hacia arriba, así que el conjunto se baja un poco
  const cy = alto / 2 + D * 0.22
  const yBisagra = cy - D / 2

  // 150° de recorrido: pasado el vertical la tapa cae hacia atrás
  const theta = p * (Math.PI * 150) / 180
  const cos = Math.cos(theta)
  const abierto = Math.max(0, Math.min(1, (p - 0.12) / 0.5))

  /* ── Sombra proyectada ─────────────────────────────────────────────── */
  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.filter = 'blur(18px)'
  ctx.fillStyle = '#000'
  cuadrilatero(ctx, cx, yBisagra + 10, W * 1.02, D, 0.04, 1.02)
  ctx.fill()
  ctx.restore()

  /* ── Base: se ve el forro interior ─────────────────────────────────── */
  cuadrilatero(ctx, cx, yBisagra, W, D, 0, 1)
  ctx.fillStyle = FORRO
  ctx.fill()

  // Alojamientos de tarjeta, escalonados. Aparecen con la apertura.
  ctx.save()
  ctx.globalAlpha = abierto
  for (let i = 0; i < 3; i++) {
    const t0 = 0.3 + i * 0.19
    cuadrilatero(ctx, cx, yBisagra, W * 0.9, D, t0, t0 + 0.16)
    ctx.fillStyle = FORRO_SOMBRA
    ctx.fill()
  }
  ctx.restore()

  // Placa con el monograma, dentro
  ctx.save()
  ctx.globalAlpha = abierto
  cuadrilatero(ctx, cx, yBisagra, W * 0.3, D, 0.1, 0.2)
  ctx.fillStyle = ORO
  ctx.fill()
  ctx.restore()

  // Canto de la base
  cuadrilatero(ctx, cx, yBisagra, W, D, 0, 1)
  ctx.strokeStyle = PIEL_SOMBRA
  ctx.lineWidth = 2
  ctx.stroke()

  /* ── Tapa ──────────────────────────────────────────────────────────────
     Rota sobre el borde del fondo. Con `cos > 0` cae hacia el frente y se ve
     su cara exterior; pasado el vertical se tumba hacia atrás y se ve el
     forro. La profundidad proyectada es D·cos(θ): así se acorta al levantarse,
     que es lo que hace creíble el giro sin motor 3D.
     ──────────────────────────────────────────────────────────────────── */
  const tTapa = cos
  const caraExterior = cos > 0

  cuadrilatero(ctx, cx, yBisagra, W, D, 0, tTapa)

  if (caraExterior) {
    const g = ctx.createLinearGradient(0, yBisagra, 0, yBisagra + D * Math.max(tTapa, 0.05))
    g.addColorStop(0, PIEL_SOMBRA)
    g.addColorStop(1, PIEL)
    ctx.fillStyle = g
  } else {
    ctx.fillStyle = FORRO
  }
  ctx.fill()

  ctx.strokeStyle = caraExterior ? PIEL_SOMBRA : FORRO_SOMBRA
  ctx.lineWidth = 2
  ctx.stroke()

  // Pespunte, solo cuando la tapa tiene superficie visible
  const superficie = Math.min(1, Math.abs(tTapa) * 3)
  if (superficie > 0.05) {
    cuadrilatero(ctx, cx, yBisagra, W * 0.93, D, 0.04 * Math.sign(tTapa || 1), tTapa * 0.93)
    pespunte(ctx, caraExterior ? ORO : PIEL, 0.4 * superficie)
  }

  /* ── Cierre metálico, en el canto de la tapa ───────────────────────── */
  ctx.save()
  ctx.globalAlpha = 0.85
  ctx.fillStyle = ORO
  const yCierre = yBisagra + D * tTapa
  const saCierre = semiancho(W, Math.max(tTapa, -0.6))
  ctx.fillRect(cx - saCierre, yCierre - 2, saCierre * 2, 4)
  ctx.restore()
}
