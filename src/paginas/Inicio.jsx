import { Link } from 'react-router-dom'
import { COLUMNAS_MATERIAL, IMG } from '../data/imagenes'
import { CIERRE, PRODUCTOS } from '../data/productos'
import Foto from '../components/Foto'
import Bloque from '../components/Bloque'
import TextoIluminado from '../components/TextoIluminado'
import PiezasApiladas from '../components/PiezasApiladas'
/* Sin `lazy`: la portada es lo primero que se ve. Cargarla aparte metía un
   salto de red antes de pintar nada. No arrastra GSAP —el vídeo va solo—, así
   que tampoco engorda el paquete como lo hacía la portada de fotogramas. */
import PortadaVideo from '../components/apertura/PortadaVideo'

/* ── Manifiesto ───────────────────────────────────────────────────────────
   La frase se enciende palabra por palabra mientras se baja: el ritmo de
   lectura lo pone el visitante, no un temporizador. Es el único texto del
   sitio que hace esto. Si lo hicieran todos, dejaría de significar algo.
   ──────────────────────────────────────────────────────────────────────── */
function Manifiesto() {
  return (
    <section className="relative z-10 bg-black py-[clamp(5rem,9vw,8rem)]">
      <div className="canal">
        <Bloque className="text-center">
          <p className="versalita text-nota text-oro">El argumento</p>
        </Bloque>

        {/* Enorme y centrado, sobre negro. El texto ES la sección: no lleva
            fotografía ni banda de color que le compita. */}
        <TextoIluminado className="mx-auto mt-12 max-w-[22ch] text-center font-[family-name:var(--font-display)] text-portada leading-[1.1] text-marfil">
          Una casa de marroquinería no se mide por lo que muestra, sino por lo que
          sostiene treinta años después.
        </TextoIluminado>

        <Bloque className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[50ch] text-center">
          <p className="text-menor leading-relaxed text-humo">
            MONTESACRO nace de una convicción incómoda: casi todo lo que hoy se vende como
            lujo está hecho para durar una temporada. Nosotros trabajamos al revés.
            Elegimos pieles que envejecen bien, herrajes que se pueden reemplazar y
            costuras que se pueden reparar. Cada pieza sale con un número de serie, porque
            algún día alguien va a querer saber cuándo se hizo y quién la hizo.
          </p>
        </Bloque>
      </div>
    </section>
  )
}

/* ── Las piezas: dispersas sobre negro, no en bandas alternas ─────────────
   Encabezado centrado y estrecho, y debajo las tres piezas repartidas a
   alturas y anchos distintos, cada una a su velocidad. El aire entre ellas
   es parte del argumento: una casa de tres piezas puede permitirse el vacío.
   ──────────────────────────────────────────────────────────────────────── */
function LasPiezas() {
  return (
    <section className="relative z-10 bg-black pt-[clamp(2rem,4vw,3.5rem)] pb-[clamp(4rem,9vw,7rem)]">
      <div className="canal">
        <Bloque className="text-center">
          <p className="versalita text-nota text-oro">Las piezas</p>
          {/* Sin ancho máximo en el bloque: a este cuerpo de letra, 30ch parte
              el titular en tres líneas. El límite va en el párrafo. */}
          <h2 className="mx-auto mt-8 max-w-[20ch] font-[family-name:var(--font-display)] text-portada leading-[1.08] text-marfil">
            Tres piezas. Nada más.
          </h2>
          <p className="mx-auto mt-8 max-w-[46ch] text-menor leading-relaxed text-humo">
            Cada una en cuatro pieles, cortadas de un solo lomo. No hay colecciones de
            temporada: si una pieza entra al catálogo, se queda.
          </p>
        </Bloque>
      </div>

      {/* Paneles apilados: cada pieza tapa a la anterior al subir. */}
      <div className="mt-[clamp(2.5rem,5vw,4rem)]">
        <PiezasApiladas productos={PRODUCTOS} />
      </div>

      <div className="canal mt-[clamp(3rem,6vw,5rem)] text-center">
        <Bloque>
          <Link
            to="/catalogo"
            className="versalita border-b border-acento pb-1.5 text-menor text-marfil transition-colors duration-400 hover:text-acento"
          >
            Catálogo completo
          </Link>
        </Bloque>
      </div>
    </section>
  )
}

/* ── El cierre: el único lugar donde la marca aparece por fuera ──────────── */
function ElCierre() {
  return (
    <section className="relative z-10 bg-black">
      {/* Mismo mecanismo que las piezas: la fotografía se fija y la ficha
          técnica pasa a su lado. Sin fundidos ni parallax. */}
      <div className="canal grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
            <Foto
              imagen={IMG.cierre}
              ratio="1 / 1"
              sizes="(min-width: 64rem) 46vw, 100vw"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex min-h-[45svh] items-center py-[clamp(3rem,7vw,5rem)] lg:min-h-svh lg:py-0">
          <div className="w-full max-w-[38rem]">
            <h2 className="font-[family-name:var(--font-display)] text-titulo leading-[1.08] text-marfil">
              Un cierre que no se parece a ningún otro
            </h2>

            <p className="mt-7 max-w-[46ch] text-menor leading-relaxed text-humo">
              Es la primera de las dos apariciones de la marca en la pieza. Fundido en
              zamak macizo, con el monograma MS integrado en el tirador y acabado en
              dorado antiguo cepillado, para que resalte contra la piel sin brillar.
            </p>

            <dl className="mt-11 border-t border-oro/34">
              {[
                ['Material', CIERRE.material],
                ['Acabado', CIERRE.acabado],
                ['Sistema', CIERRE.sistema],
                ['Durabilidad', CIERRE.durabilidad],
                ['Tirador', CIERRE.medidas],
              ].map(([clave, valor]) => (
                <div
                  key={clave}
                  className="flex items-baseline justify-between gap-6 border-b border-oro/34 py-3.5"
                >
                  <dt className="shrink-0 text-nota text-humo">{clave}</dt>
                  <dd className="troquel text-right text-nota text-marfil">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Antesala de la experiencia ─────────────────────────────────────────── */
function AntesalaExperiencia() {
  return (
    <section className="relative z-10 bg-black py-[clamp(4rem,9vw,7.5rem)]">
      <div className="canal">
        <Bloque className="mx-auto max-w-[46rem] text-center">
          <h2 className="font-[family-name:var(--font-display)] text-portada leading-[1.08] text-marfil">La caja también es la pieza</h2>
          <p className="mx-auto mt-7 max-w-[52ch] text-menor leading-relaxed text-humo">
            Bolsa de compra, caja rígida con cierre magnético, bolsa de algodón y tarjeta
            de autenticidad numerada. Cuatro elementos diseñados a la medida de cada
            producto, de afuera hacia adentro.
          </p>
          <Link
            to="/experiencia"
            className="versalita mt-10 inline-block border-b border-acento pb-1.5 text-menor text-marfil transition-colors duration-400 hover:text-acento"
          >
            Ver la experiencia completa
          </Link>
        </Bloque>

        {/* Sin parallax: MORAE no lo usa. Las cuatro piezas del empaque se
            miran quietas, en una fila sobria, y el peso lo lleva la sección
            fijada de /experiencia. */}
        <div className="mt-[clamp(3rem,7vw,5rem)] grid grid-cols-2 gap-3 lg:grid-cols-4">
          {COLUMNAS_MATERIAL.map((c) => (
            <figure key={c.imagen.id}>
              <Foto imagen={c.imagen} ratio="3 / 4" sizes="(min-width: 64rem) 24vw, 48vw" />
              <figcaption className="versalita mt-4 text-nota text-humo">
                {c.imagen.pie}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Inicio() {
  return (
    <>
      {/* La portada es el metraje de las piezas, no una fotografía quieta.
          Único bloque con movimiento de esta escala, y funciona porque todo lo
          demás está parado. Ver components/apertura/PortadaVideo. */}
      <PortadaVideo />
      <Manifiesto />
      <LasPiezas />
      <ElCierre />
      <AntesalaExperiencia />
    </>
  )
}
