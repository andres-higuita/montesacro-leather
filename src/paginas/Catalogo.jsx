import { PRODUCTOS } from '../data/productos'
import TarjetaPieza from '../components/TarjetaPieza'
import Reveal from '../components/Reveal'
import { FileteConRombo } from '../components/Rombo'

export default function Catalogo() {
  const [primera, ...resto] = PRODUCTOS

  return (
    <>
      <section className="canal pt-[clamp(7.5rem,14vw,11rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <Reveal>
          <h1 className="text-portada text-grafia">Las piezas</h1>
          <p className="prosa mt-7 text-grafia-suave">
            La casa mantiene tres piezas en producción, cada una en cuatro pieles. No hay
            colecciones de temporada ni ediciones que se retiran: si una pieza entra al
            catálogo, se queda, y se puede reparar diez años después.
          </p>
        </Reveal>
      </section>

      <section className="canal pb-[clamp(5rem,12vw,10rem)]">
        <div className="grid gap-x-8 gap-y-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-2">
          <TarjetaPieza producto={primera} destacada />
          {resto.map((p) => (
            <TarjetaPieza key={p.id} producto={p} />
          ))}
        </div>

        <FileteConRombo className="mt-[clamp(4rem,8vw,7rem)] text-grafia" />

        <Reveal className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[52ch] text-center">
          <p className="text-menor leading-relaxed text-grafia-suave">
            Las pieles exóticas provienen de criaderos con trazabilidad documentada. El
            patrón de escamas de cada corte es irrepetible, de modo que dos piezas del
            mismo color nunca son idénticas.
          </p>
        </Reveal>
      </section>
    </>
  )
}
