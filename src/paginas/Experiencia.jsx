import { EMPAQUE } from '../data/productos'
import { IMG } from '../data/imagenes'
import Bloque from '../components/Bloque'
import Rombo, { FileteConRombo } from '../components/Rombo'
import SelloAutenticidad from '../components/SelloAutenticidad'
import BloquePersonalizacion from '../components/BloquePersonalizacion'
import PasoFijado from '../components/PasoFijado'
import Foto from '../components/Foto'
import { useMundoDeCabecera } from '../tema/cabecera'

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

      {/* ── Cuatro elementos, de afuera hacia adentro ───────────────────
          Cada paso fija su fotografía a media pantalla mientras su texto
          recorre la otra mitad. Encadenados, los cuatro se leen como una sola
          secuencia de apertura en vez de como cuatro bandas sueltas.

          La foto va siempre a la izquierda: alternar lados rompería esa
          sensación de secuencia. */}
      <section className="pt-[clamp(4rem,10vw,8rem)]">
        <div className="canal">
          <Bloque className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
            <h2 className="text-titulo text-grafia">Elementos del empaque</h2>
            <p className="versalita text-nota text-acento">De afuera hacia adentro</p>
          </Bloque>
        </div>

        <div className="mt-[clamp(3rem,7vw,5.5rem)]">
          {EMPAQUE.map((el) => (
            <PasoFijado key={el.id} elemento={el} imagen={IMG[el.imagen]} />
          ))}
        </div>
      </section>

      {/* ── Tarjeta de autenticidad ───────────────────────────────────── */}
      <section
        id="autenticidad"
        className="mundo-vino scroll-mt-24 py-[clamp(5rem,12vw,9rem)]"
      >
        <div className="canal grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Bloque>
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
          </Bloque>

          <Bloque className="w-full max-w-[30rem] justify-self-center lg:justify-self-end">
            <SelloAutenticidad />
          </Bloque>
        </div>
      </section>

      {/* ── Personalización ───────────────────────────────────────────── */}
      <section
        id="personalizacion"
        className="scroll-mt-24 py-[clamp(5rem,12vw,9rem)]"
      >
        <div className="canal">
          <Bloque>
            <BloquePersonalizacion />
          </Bloque>
        </div>
      </section>

      {/* ── Características del sistema ───────────────────────────────── */}
      <section className="mundo-contra py-[clamp(4.5rem,10vw,8rem)]">
        <div className="canal">
          <Bloque className="text-center">
            <h2 className="text-titulo text-grafia">Características del sistema</h2>
          </Bloque>

          <dl className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {CARACTERISTICAS.map(([titulo, texto]) => (
              <Bloque key={titulo} as="div">
                <dt className="border-t filete pt-5 font-[family-name:var(--font-display)] text-mayor text-grafia">
                  {titulo}
                </dt>
                <dd className="mt-3 text-menor leading-relaxed text-grafia-suave">{texto}</dd>
              </Bloque>
            ))}
          </dl>

          <FileteConRombo className="mt-[clamp(3.5rem,7vw,5.5rem)] text-grafia" />
        </div>
      </section>
    </>
  )
}
