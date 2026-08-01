import { COLORWAYS } from '../data/productos'

/**
 * Selector de piel.
 *
 * Accesibilidad: el color nunca es el único portador de la información — cada
 * ficha lleva su nombre visible, `aria-pressed` y un filete de acento.
 *
 * No recibe tema ni mundo: consume roles de color y hereda del contenedor.
 */
export default function SelectorColor({ colorways, activo, alCambiar, className = '' }) {
  return (
    <div className={className}>
      <p className="versalita text-nota text-acento" id="etiqueta-piel">
        Piel
      </p>

      <div
        className="mt-4 flex flex-wrap gap-x-6 gap-y-5"
        role="group"
        aria-labelledby="etiqueta-piel"
      >
        {colorways.map((id) => {
          const cw = COLORWAYS[id]
          const seleccionado = id === activo

          return (
            <button
              key={id}
              type="button"
              onClick={() => alCambiar(id)}
              aria-pressed={seleccionado}
              className="group flex w-[4.75rem] flex-col items-center gap-2.5 text-center"
            >
              <span
                className="relative block h-11 w-11 rounded-ficha transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                style={{ backgroundColor: cw.token }}
              >
                {/* Filete de estado: no es el único indicador, acompaña al nombre */}
                <span
                  aria-hidden="true"
                  className={`absolute -inset-[5px] rounded-ficha border transition-opacity duration-400 ${
                    seleccionado ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ borderColor: 'var(--color-acento)' }}
                />
                {/* Grano de piel: relieve sutil, no textura decorativa */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-ficha"
                  style={{
                    boxShadow:
                      'inset 0 1px 0 rgb(255 255 255 / 0.14), inset 0 -6px 10px rgb(0 0 0 / 0.35)',
                  }}
                />
              </span>

              <span
                className={`text-nota leading-tight transition-colors duration-300 ${
                  seleccionado ? 'text-grafia' : 'text-grafia-suave'
                }`}
              >
                {cw.nombre}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
