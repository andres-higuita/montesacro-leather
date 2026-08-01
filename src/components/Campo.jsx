import { useId } from 'react'

/**
 * Primitivas de formulario del checkout.
 *
 * Reglas comunes a todas:
 * - La etiqueta siempre es visible. Nada de placeholders haciendo de etiqueta:
 *   desaparecen al escribir y dejan al usuario sin referencia.
 * - El error se anuncia por `aria-describedby` y `aria-invalid`, y además se
 *   marca con el filete en tono de alerta: nunca solo por color.
 * - Sin sombras ni bordes redondeados: la ficha de pedido es un documento, y
 *   se dibuja con los mismos filetes que las fichas técnicas.
 */

const claseControl = (invalido) =>
  `mt-2.5 w-full border bg-transparent px-4 py-3 text-menor text-grafia transition-colors duration-300 ${
    invalido ? 'border-alerta' : 'filete'
  } placeholder:text-grafia/70`

function Etiqueta({ htmlFor, children, opcional }) {
  return (
    <label htmlFor={htmlFor} className="versalita flex items-baseline gap-2 text-nota text-acento">
      {children}
      {opcional && <span className="text-grafia-suave lowercase">· opcional</span>}
    </label>
  )
}

function Error({ id, texto }) {
  if (!texto) return null
  return (
    <p id={id} className="mt-2 text-nota text-alerta">
      {texto}
    </p>
  )
}

export function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  error,
  ayuda,
  opcional = false,
  className = '',
  ...resto
}) {
  const id = useId()
  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`

  return (
    <div className={className}>
      <Etiqueta htmlFor={id} opcional={opcional}>
        {etiqueta}
      </Etiqueta>

      <input
        id={id}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[error && idError, ayuda && idAyuda].filter(Boolean).join(' ') || undefined}
        className={claseControl(Boolean(error))}
        {...resto}
      />

      {ayuda && (
        <p id={idAyuda} className="mt-2 text-nota text-grafia-suave">
          {ayuda}
        </p>
      )}
      <Error id={idError} texto={error} />
    </div>
  )
}

export function CampoSelect({ etiqueta, valor, alCambiar, error, opciones, className = '' }) {
  const id = useId()
  const idError = `${id}-error`

  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>

      <select
        id={id}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? idError : undefined}
        className={claseControl(Boolean(error))}
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor} className="bg-lienzo text-grafia">
            {o.texto}
          </option>
        ))}
      </select>

      <Error id={idError} texto={error} />
    </div>
  )
}

/**
 * Grupo de opciones excluyentes, dibujadas como fichas.
 * Cada una lleva título y descripción: en una compra de este tipo la diferencia
 * entre métodos importa más que el nombre del método.
 */
export function GrupoOpciones({ etiqueta, valor, alCambiar, opciones, error, className = '' }) {
  const id = useId()
  const idError = `${id}-error`

  return (
    <fieldset
      className={className}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? idError : undefined}
    >
      <legend className="versalita text-nota text-acento">{etiqueta}</legend>

      <div className="mt-4 grid gap-3">
        {opciones.map((o) => {
          const activa = valor === o.valor
          return (
            <label
              key={o.valor}
              className={`flex cursor-pointer items-start gap-4 border px-5 py-4 transition-colors duration-300 ${
                activa ? 'border-acento bg-realce' : 'filete hover:bg-realce/45'
              }`}
            >
              <input
                type="radio"
                name={id}
                value={o.valor}
                checked={activa}
                onChange={() => alCambiar(o.valor)}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-acento)]"
              />
              <span>
                <span className="block text-menor text-grafia">{o.texto}</span>
                {o.detalle && (
                  <span className="mt-1 block text-nota leading-relaxed text-grafia-suave">
                    {o.detalle}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>

      <Error id={idError} texto={error} />
    </fieldset>
  )
}
