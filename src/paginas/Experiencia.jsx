import { motion, useReducedMotion } from 'motion/react'
import { EMPAQUE } from '../data/productos'
import { IMG, juegoDeFotos } from '../data/imagenes'
import Reveal from '../components/Reveal'
import Rombo, { FileteConRombo } from '../components/Rombo'
import SelloAutenticidad from '../components/SelloAutenticidad'
import BloquePersonalizacion from '../components/BloquePersonalizacion'
import Foto from '../components/Foto'
import { useMundoDeCabecera } from '../tema/cabecera'

/**
 * Apertura: la fotografía se descubre de abajo hacia arriba.
 *
 * Es la única excepción a la gramática de entrada del sitio, y está justificada
 * porque el contenido *es* una apertura: la caja abriéndose (ver DESIGN.md).
 */
function Apertura({ imagen, ratio = '4 / 3', sizes, className = '' }) {
  const reducido = useReducedMotion()
  const { src, srcSet } = juegoDeFotos(imagen.id, [700, 1100, 1600])

  return (
    <div className={`overflow-hidden bg-lienzo-alto ${className}`} style={{ aspectRatio: ratio }}>
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={imagen.alt}
        loading="lazy"
        className="h-full w-full object-cover"
        initial={reducido ? false : { clipPath: 'inset(100% 0 0 0)', scale: 1.05 }}
        whileInView={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reducido ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

/** Un elemento del sistema de empaque. */
function Elemento({ elemento, invertido }) {
  return (
    <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <Apertura
        imagen={IMG[elemento.imagen]}
        ratio="4 / 3"
        sizes="(min-width: 64rem) 50vw, 100vw"
        className={invertido ? 'lg:order-2' : ''}
      />

      <Reveal className={invertido ? 'lg:order-1' : ''}>
        <div className="flex items-baseline gap-5">
          {/* La única secuencia numerada del sitio: el empaque SÍ es un orden */}
          <span className="troquel text-mayor text-acento" aria-hidden="true">
            {String(elemento.orden).padStart(2, '0')}
          </span>
          <h3 className="text-titulo text-grafia">{elemento.nombre}</h3>
        </div>

        <p className="prosa mt-6 text-grafia-suave">{elemento.entrada}</p>

        <dl className="mt-9 border-t filete">
          {elemento.specs.map(([clave, valor]) => (
            <div
              key={clave}
              className="flex items-baseline justify-between gap-6 border-b filete py-3"
            >
              <dt className="shrink-0 text-menor text-grafia-suave">{clave}</dt>
              <dd className="troquel text-right text-menor text-grafia">{valor}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </article>
  )
}

const CARACTERISTICAS = [
  ['Diseño atemporal', 'Que trascienda el tiempo.'],
  ['Calidad excepcional', 'Materiales seleccionados cuidadosamente.'],
  ['Identidad única', 'Cada detalle comunica quiénes somos.'],
  ['Experiencia memorable', 'Pensada para emocionar desde el primer momento.'],
]

export default function Experiencia() {
  // La primera banda es vinotinto: el encabezado flotante debe leerse sobre
  // ella en los dos temas, no solo en el oscuro.
  useMundoDeCabecera('vino')

  return (
    <>
      {/* ── Portada de sección ────────────────────────────────────────── */}
      <section className="mundo-vino pt-[clamp(7.5rem,14vw,11rem)] pb-[clamp(4rem,9vw,7rem)]">
        <div className="canal grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-20">
          <div>
            <h1 className="text-portada text-grafia">
              La experiencia <span className="text-acento">Montesacro</span>
            </h1>
            <p className="prosa mt-8 text-grafia/75">
              Cada elemento ha sido diseñado a la medida de nuestras piezas, cuidando cada
              detalle para ofrecer una experiencia que refleja la esencia de MONTESACRO:
              elegancia, tradición y exclusividad desde el primer momento.
            </p>
          </div>

          <Foto
            imagen={IMG.cajaRigida}
            ratio="5 / 4"
            sizes="(min-width: 64rem) 40vw, 100vw"
            prioridad
          />
        </div>
      </section>

      {/* ── Cuatro elementos, de afuera hacia adentro ─────────────────── */}
      <section className="py-[clamp(5rem,12vw,10rem)]">
        <div className="canal">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
            <h2 className="text-titulo text-grafia">Elementos del empaque</h2>
            <p className="versalita text-nota text-acento">De afuera hacia adentro</p>
          </Reveal>

          <div className="mt-[clamp(3rem,7vw,5.5rem)] space-y-[clamp(4.5rem,10vw,9rem)]">
            {EMPAQUE.map((el, i) => (
              <Elemento key={el.id} elemento={el} invertido={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarjeta de autenticidad ───────────────────────────────────── */}
      <section
        id="autenticidad"
        className="mundo-vino scroll-mt-24 py-[clamp(5rem,12vw,9rem)]"
      >
        <div className="canal grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="text-titulo text-grafia">
              El número que va a importar dentro de treinta años
            </h2>
            <p className="prosa mt-7 text-grafia/75">
              Cada pieza sale de la casa con una tarjeta impresa en letterpress sobre
              cartulina de algodón de 700 g/m², con un número de serie que no se repite.
              Ese número queda en nuestro registro: permite verificar la pieza, pedir una
              reparación y, llegado el caso, acreditar su procedencia ante quien la herede.
            </p>

            <ul className="mt-10 space-y-3.5">
              {[
                'Registro permanente de fabricación',
                'Verificación de autenticidad ante terceros',
                'Trazabilidad para reparación y mantenimiento',
              ].map((linea) => (
                <li key={linea} className="flex items-center gap-3.5 text-menor text-grafia/80">
                  <Rombo size={5} className="text-acento" />
                  {linea}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal indice={1} className="w-full max-w-[30rem] justify-self-center lg:justify-self-end">
            <SelloAutenticidad />
          </Reveal>
        </div>
      </section>

      {/* ── Personalización ───────────────────────────────────────────── */}
      <section
        id="personalizacion"
        className="scroll-mt-24 py-[clamp(5rem,12vw,9rem)]"
      >
        <div className="canal">
          <Reveal>
            <BloquePersonalizacion />
          </Reveal>
        </div>
      </section>

      {/* ── Características del sistema ───────────────────────────────── */}
      <section className="mundo-contra py-[clamp(4.5rem,10vw,8rem)]">
        <div className="canal">
          <Reveal className="text-center">
            <h2 className="text-titulo text-grafia">Características del sistema</h2>
          </Reveal>

          <dl className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {CARACTERISTICAS.map(([titulo, texto], i) => (
              <Reveal key={titulo} indice={i} as="div">
                <dt className="border-t filete pt-5 font-[family-name:var(--font-display)] text-mayor text-grafia">
                  {titulo}
                </dt>
                <dd className="mt-3 text-menor leading-relaxed text-grafia-suave">{texto}</dd>
              </Reveal>
            ))}
          </dl>

          <FileteConRombo className="mt-[clamp(3.5rem,7vw,5.5rem)] text-grafia" />
        </div>
      </section>
    </>
  )
}
