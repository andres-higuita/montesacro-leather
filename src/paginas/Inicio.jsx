import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { IMG, IMG_PRODUCTO, juegoDeFotos } from '../data/imagenes'
import { CIERRE, PRODUCTOS } from '../data/productos'
import Foto from '../components/Foto'
import Reveal from '../components/Reveal'
import Rombo, { FileteConRombo } from '../components/Rombo'
import Monograma from '../components/Monograma'

/* GSAP pesa ~140 kB y solo lo usa esta sección. Cargándolo aparte, el
   catálogo, la ficha y el checkout no lo descargan nunca. */
const AperturaScroll = lazy(() => import('../components/apertura/AperturaScroll'))
const RECORRIDO_APERTURA = 3

/* ── Portada ──────────────────────────────────────────────────────────────
   Composición de doble página, como una lámina del collection book: el texto
   ocupa la izquierda y la fotografía sangra por el borde derecho. Se evita a
   propósito la foto centrada y flotante sobre negro (ver PRODUCT.md).
   ──────────────────────────────────────────────────────────────────────── */
function Portada() {
  const reducido = useReducedMotion()
  const { src, srcSet } = juegoDeFotos(IMG.portada.id, [900, 1400, 2000])

  return (
    <section className="relative grid min-h-[92svh] items-center gap-14 pt-28 pb-20 lg:grid-cols-[0.92fr_1fr] lg:gap-0 lg:pt-24 lg:pb-0">
      {/* Sin `canal`: el borde izquierdo se alinea a mano con el contenedor
          para que la fotografía pueda sangrar por la derecha. */}
      <div className="px-[var(--medida-canal)] lg:pr-14 lg:pl-[max(var(--medida-canal),calc((100vw-var(--medida-ancho))/2+var(--medida-canal)))]">
        <motion.div
          initial={reducido ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Monograma size={34} className="text-acento" />

          <h1 className="mt-8 text-monte">
            <span className="block">Objetos de legado.</span>
            <span className="mt-1 block text-acento">Hechos para trascender.</span>
          </h1>

          <p className="prosa mt-9 text-grafia-suave">
            Tres piezas en piel exótica, cortadas de un solo lomo y cosidas a mano en
            nuestro taller. Sin logo a la vista: la marca aparece dos veces, en el cierre
            metálico y en la placa interior. Quien la reconozca, ya sabía.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-4">
            <Link
              to="/catalogo"
              className="versalita border-b border-acento pb-1.5 text-menor text-grafia transition-colors duration-400 hover:text-acento"
            >
              Ver las piezas
            </Link>
            <Link
              to="/experiencia"
              className="versalita text-menor text-grafia-suave transition-colors duration-400 hover:text-grafia"
            >
              La experiencia Montesacro
            </Link>
          </div>
        </motion.div>
      </div>

      {/* La fotografía sangra por el borde derecho del viewport */}
      <div className="relative h-[62svh] overflow-hidden lg:h-[92svh]">
        <motion.img
          src={src}
          srcSet={srcSet}
          sizes="(min-width: 64rem) 55vw, 100vw"
          alt={IMG.portada.alt}
          fetchPriority="high"
          className="h-full w-full object-cover"
          initial={reducido ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lienzo via-lienzo/25 to-transparent lg:from-lienzo lg:via-transparent"
        />
        {/* Velo superior: el encabezado flotante cruza esta fotografía y en el
            tema claro su grafía es oscura. Sin este degradado deja de leerse. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-lienzo via-lienzo/55 to-transparent"
        />
      </div>
    </section>
  )
}

/* ── Manifiesto ─────────────────────────────────────────────────────────── */
function Manifiesto() {
  return (
    <section className="mundo-vino py-[clamp(5rem,12vw,10rem)]">
      <div className="canal">
        <Reveal className="mx-auto max-w-[54ch] text-center">
          <Rombo className="text-acento" />
          <p className="mt-9 font-[family-name:var(--font-display)] text-titulo leading-[1.28] text-grafia">
            Una casa de marroquinería no se mide por lo que muestra, sino por lo que
            sostiene treinta años después.
          </p>
          <p className="mt-8 text-menor leading-relaxed text-grafia/72">
            MONTESACRO nace de una convicción incómoda: casi todo lo que hoy se vende como
            lujo está hecho para durar una temporada. Nosotros trabajamos al revés.
            Elegimos pieles que envejecen bien, herrajes que se pueden reemplazar y
            costuras que se pueden reparar. Cada pieza sale con un número de serie, porque
            algún día alguien va a querer saber cuándo se hizo y quién la hizo.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Las piezas: bandas alternas, no una retícula de cards ───────────────── */
function Pieza({ producto, indice }) {
  const imagenes = IMG_PRODUCTO[producto.id]
  const portada = imagenes?.colorways?.[producto.colorways[0]]
  const invertida = indice % 2 === 1

  return (
    <Reveal
      as="article"
      className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-20"
    >
      <div className={invertida ? 'lg:order-2' : ''}>
        <Foto
          imagen={portada}
          ratio="16 / 11"
          sizes="(min-width: 64rem) 55vw, 100vw"
        />
      </div>

      <div className={invertida ? 'lg:order-1' : ''}>
        <p className="versalita text-nota text-acento">{producto.familia}</p>
        <h3 className="mt-5 text-titulo text-grafia">{producto.nombre}</h3>
        <p className="prosa mt-6 text-grafia-suave">{producto.esencia}</p>

        <Link
          to={`/producto/${producto.slug}`}
          className="versalita mt-9 inline-block border-b border-acento pb-1.5 text-menor text-grafia transition-colors duration-400 hover:text-acento"
        >
          Ficha completa
        </Link>
      </div>
    </Reveal>
  )
}

function LasPiezas() {
  return (
    <section className="py-[clamp(5rem,12vw,10rem)]">
      <div className="canal">
        <Reveal className="flex items-end justify-between gap-8">
          <h2 className="text-titulo text-grafia">Tres piezas. Nada más.</h2>
          <Link
            to="/catalogo"
            className="versalita hidden shrink-0 pb-1 text-menor text-grafia-suave transition-colors duration-400 hover:text-grafia sm:block"
          >
            Catálogo completo
          </Link>
        </Reveal>

        <div className="mt-[clamp(3rem,6vw,5rem)] space-y-[clamp(4rem,9vw,8rem)]">
          {PRODUCTOS.map((p, i) => (
            <Pieza key={p.id} producto={p} indice={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── El cierre: el único lugar donde la marca aparece por fuera ──────────── */
function ElCierre() {
  return (
    <section className="mundo-base border-t border-grafia/10">
      <div className="grid lg:grid-cols-2">
        <Foto
          imagen={IMG.cierre}
          ratio="1 / 1"
          sizes="(min-width: 64rem) 50vw, 100vw"
          className="lg:h-full"
        />

        <div className="flex items-center px-[var(--medida-canal)] py-[clamp(4rem,9vw,7rem)]">
          <Reveal className="w-full max-w-[38rem]">
            <h2 className="text-titulo text-grafia">
              Un cierre que no se parece a ningún otro
            </h2>

            <p className="prosa mt-7 text-grafia-suave">
              Es la primera de las dos apariciones de la marca en la pieza. Fundido en
              zamak macizo, con el monograma MS integrado en el tirador y acabado en
              dorado antiguo cepillado, para que resalte contra la piel sin brillar.
            </p>

            <dl className="mt-11 border-t filete">
              {[
                ['Material', CIERRE.material],
                ['Acabado', CIERRE.acabado],
                ['Sistema', CIERRE.sistema],
                ['Durabilidad', CIERRE.durabilidad],
                ['Tirador', CIERRE.medidas],
              ].map(([clave, valor]) => (
                <div
                  key={clave}
                  className="flex items-baseline justify-between gap-6 border-b filete py-3.5"
                >
                  <dt className="shrink-0 text-menor text-grafia-suave">{clave}</dt>
                  <dd className="troquel text-right text-menor text-grafia">{valor}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Antesala de la experiencia ─────────────────────────────────────────── */
function AntesalaExperiencia() {
  return (
    <section className="mundo-contra py-[clamp(5rem,12vw,10rem)]">
      <div className="canal">
        <Reveal className="mx-auto max-w-[46rem] text-center">
          <h2 className="text-titulo text-grafia">La caja también es la pieza</h2>
          <p className="mt-7 text-grafia-suave">
            Bolsa de compra, caja rígida con cierre magnético, bolsa de algodón y tarjeta
            de autenticidad numerada. Cuatro elementos diseñados a la medida de cada
            producto, de afuera hacia adentro.
          </p>
          <Link
            to="/experiencia"
            className="versalita mt-10 inline-block border-b border-acento pb-1.5 text-menor text-grafia transition-colors duration-400 hover:text-acento"
          >
            Ver la experiencia completa
          </Link>
        </Reveal>

        <Reveal className="mt-[clamp(3rem,6vw,4.5rem)] grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[IMG.bolsaCompra, IMG.cajaRigida, IMG.bolsaAlgodon, IMG.tarjetaAutenticidad].map(
            (img) => (
              <Foto
                key={img.id}
                imagen={img}
                ratio="3 / 4"
                sizes="(min-width: 64rem) 25vw, 50vw"
              />
            ),
          )}
        </Reveal>

        <FileteConRombo className="mt-[clamp(3rem,6vw,4.5rem)] text-grafia" />
      </div>
    </section>
  )
}

export default function Inicio() {
  return (
    <>
      <Portada />
      {/* Único bloque del sitio con movimiento de esta escala: funciona porque
          todo lo demás está quieto. Ver components/apertura/AperturaScroll.
          El respaldo reserva la misma altura para que la página no salte. */}
      <Suspense
        fallback={<div style={{ height: `${RECORRIDO_APERTURA * 100}svh` }} aria-hidden="true" />}
      >
        <AperturaScroll recorrido={RECORRIDO_APERTURA} />
      </Suspense>
      <Manifiesto />
      <LasPiezas />
      <ElCierre />
      <AntesalaExperiencia />
    </>
  )
}
