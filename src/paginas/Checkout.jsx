import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCarrito } from '../carrito/contexto'
import { CampoSelect, CampoTexto, GrupoOpciones } from '../components/Campo'
import ResumenPedido from '../components/ResumenPedido'
import Rombo from '../components/Rombo'

/* ── Validación ────────────────────────────────────────────────────────────
   Solo de formato. No hay backend que verifique nada, y el prototipo no debe
   fingir que lo hay.
   ───────────────────────────────────────────────────────────────────────── */

const vacio = (v) => !v || !v.trim()
const digitos = (v) => (v ?? '').replace(/\D/g, '')

const REGLAS = {
  requerido: (v) => (vacio(v) ? 'Este dato es necesario.' : null),
  email: (v) =>
    vacio(v)
      ? 'Este dato es necesario.'
      : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? null
        : 'Revise el correo: falta el @ o el dominio.',
  telefono: (v) =>
    vacio(v)
      ? 'Este dato es necesario.'
      : digitos(v).length >= 7
        ? null
        : 'Escriba al menos 7 dígitos.',
  tarjeta: (v) => {
    const d = digitos(v)
    if (!d) return 'Este dato es necesario.'
    return d.length >= 13 && d.length <= 19 ? null : 'Un número de tarjeta tiene entre 13 y 19 dígitos.'
  },
  caducidad: (v) => {
    const d = digitos(v)
    if (!d) return 'Este dato es necesario.'
    if (d.length !== 4) return 'Use el formato MM/AA.'
    const mes = Number(d.slice(0, 2))
    return mes >= 1 && mes <= 12 ? null : 'El mes va de 01 a 12.'
  },
  cvv: (v) => {
    const d = digitos(v)
    if (!d) return 'Este dato es necesario.'
    return d.length === 3 || d.length === 4 ? null : 'Son 3 o 4 dígitos.'
  },
}

/* ── Formateadores de entrada ──────────────────────────────────────────── */

const formatearTarjeta = (v) =>
  digitos(v)
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const formatearCaducidad = (v) => {
  const d = digitos(v).slice(0, 4)
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`
}

/* ── Definición de los pasos ───────────────────────────────────────────── */

const PASOS = [
  { id: 'contacto', titulo: 'Contacto' },
  { id: 'entrega', titulo: 'Entrega' },
  { id: 'pago', titulo: 'Pago' },
  { id: 'revision', titulo: 'Revisión' },
]

const PAISES = [
  { valor: 'CO', texto: 'Colombia' },
  { valor: 'MX', texto: 'México' },
  { valor: 'ES', texto: 'España' },
  { valor: 'US', texto: 'Estados Unidos' },
  { valor: 'AR', texto: 'Argentina' },
  { valor: 'CL', texto: 'Chile' },
]

const ENTREGAS = [
  {
    valor: 'envio',
    texto: 'Envío asegurado a domicilio',
    detalle: 'Con seguimiento y firma en la entrega. La pieza viaja en su caja rígida.',
  },
  {
    valor: 'taller',
    texto: 'Retiro en el taller, con cita',
    detalle:
      'Le entregamos la pieza en persona y revisamos juntos el grabado y el número de serie.',
  },
]

const PAGOS = [
  {
    valor: 'tarjeta',
    texto: 'Tarjeta de crédito o débito',
    detalle: 'Se cobra al confirmar la pieza, no al hacer el pedido.',
  },
  {
    valor: 'transferencia',
    texto: 'Transferencia bancaria',
    detalle: 'Le enviamos los datos de la cuenta por correo. La pieza entra a producción al recibirla.',
  },
  {
    valor: 'taller',
    texto: 'Pago en el taller',
    detalle: 'Solo con retiro en persona. Se paga al recibir la pieza.',
  },
]

const INICIAL = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  modoEntrega: 'envio',
  pais: 'CO',
  ciudad: '',
  direccion: '',
  detalle: '',
  notas: '',
  metodoPago: 'tarjeta',
  tarjeta: '',
  titular: '',
  caducidad: '',
  cvv: '',
}

/** Qué se valida en cada paso, según lo que el usuario haya elegido. */
function camposDelPaso(paso, datos) {
  if (paso === 'contacto') {
    return {
      nombre: REGLAS.requerido,
      apellido: REGLAS.requerido,
      email: REGLAS.email,
      telefono: REGLAS.telefono,
    }
  }

  if (paso === 'entrega') {
    if (datos.modoEntrega === 'taller') return {}
    return { ciudad: REGLAS.requerido, direccion: REGLAS.requerido }
  }

  if (paso === 'pago') {
    if (datos.metodoPago !== 'tarjeta') return {}
    return {
      tarjeta: REGLAS.tarjeta,
      titular: REGLAS.requerido,
      caducidad: REGLAS.caducidad,
      cvv: REGLAS.cvv,
    }
  }

  return {}
}

/* ── Indicador de pasos ────────────────────────────────────────────────────
   Es la segunda secuencia numerada del sitio, y la única fuera del empaque.
   Se justifica por lo mismo: es un orden real y el número dice dónde está.
   ───────────────────────────────────────────────────────────────────────── */
function Pasos({ actual, alVolverA }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {PASOS.map((p, i) => {
        const activo = i === actual
        const hecho = i < actual

        return (
          <li key={p.id} className="flex items-center gap-3">
            {hecho ? (
              <button
                type="button"
                onClick={() => alVolverA(i)}
                className="versalita text-nota text-grafia-suave transition-colors duration-300 hover:text-grafia"
              >
                <span className="troquel mr-2">{String(i + 1).padStart(2, '0')}</span>
                {p.titulo}
              </button>
            ) : (
              <span
                aria-current={activo ? 'step' : undefined}
                className={`versalita text-nota ${activo ? 'text-acento' : 'text-grafia/70'}`}
              >
                <span className="troquel mr-2">{String(i + 1).padStart(2, '0')}</span>
                {p.titulo}
              </span>
            )}
            {i < PASOS.length - 1 && <Rombo size={4} className="text-grafia/55" />}
          </li>
        )
      })}
    </ol>
  )
}

/* ── Aviso del paso de pago ────────────────────────────────────────────────
   No es decoración. Un formulario de tarjeta sin backend ni cifrado no debe
   invitar a escribir datos reales, y decirlo una sola vez en letra pequeña no
   basta. Por eso los campos van sin autocompletado de tarjetas del navegador.
   ───────────────────────────────────────────────────────────────────────── */
function AvisoPrototipo() {
  return (
    <p className="border border-alerta px-5 py-4 text-menor leading-relaxed text-grafia">
      <strong className="font-normal text-alerta">No escriba una tarjeta real.</strong> Esto es un
      prototipo de interfaz: no hay servidor, ni cifrado, ni cobro. Use cualquier número de
      relleno para ver el flujo completo.
    </p>
  )
}

export default function Checkout() {
  const { lineas, piezas } = useCarrito()
  const navegar = useNavigate()

  const [paso, setPaso] = useState(0)
  const [datos, setDatos] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const encabezadoPaso = useRef(null)

  const actual = PASOS[paso].id
  const campo = (clave) => (valor) => {
    setDatos((d) => {
      const siguiente = { ...d, [clave]: valor }
      // "Pago en el taller" solo existe con retiro en persona. Sin esto, quien
      // lo elige y después cambia a envío se queda con un método que ya no
      // aparece en la lista, y ninguna opción marcada.
      if (clave === 'modoEntrega' && valor === 'envio' && d.metodoPago === 'taller') {
        siguiente.metodoPago = 'tarjeta'
      }
      return siguiente
    })
    setErrores((e) => (e[clave] ? { ...e, [clave]: null } : e))
  }

  const resumen = useMemo(() => ({ lineas, piezas }), [lineas, piezas])

  if (lineas.length === 0) return <Navigate to="/catalogo" replace />

  const validarPaso = () => {
    const reglas = camposDelPaso(actual, datos)
    const nuevos = {}
    for (const [clave, regla] of Object.entries(reglas)) {
      const error = regla(datos[clave])
      if (error) nuevos[clave] = error
    }
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  const avanzar = () => {
    if (!validarPaso()) {
      // Lleva el foco al primer campo con error, no solo al color rojo
      requestAnimationFrame(() => {
        document.querySelector('[aria-invalid="true"]')?.focus()
      })
      return
    }
    setPaso((p) => Math.min(p + 1, PASOS.length - 1))
    requestAnimationFrame(() => encabezadoPaso.current?.focus())
  }

  const retroceder = () => {
    setErrores({})
    setPaso((p) => Math.max(p - 1, 0))
    requestAnimationFrame(() => encabezadoPaso.current?.focus())
  }

  const confirmar = () => {
    const sello = Date.now()
    const pedido = {
      numero: `MS-${new Date().getFullYear()}-${String(sello % 10000).padStart(4, '0')}`,
      datos,
      lineas: lineas.flatMap((l, i) =>
        Array.from({ length: l.cantidad }, (_, j) => ({
          ...l,
          cantidad: 1,
          serie: String((sello % 100000) + i * 7 + j).padStart(6, '0'),
        })),
      ),
      piezas,
    }
    // El carrito lo vacía la pantalla de confirmación, no esta. Si se vaciara
    // aquí, este componente re-renderizaría con el carrito vacío y su propia
    // guarda lo mandaría al catálogo antes de completar la navegación.
    navegar('/pedido-confirmado', { replace: true, state: { pedido } })
  }

  return (
    <section className="canal pt-[clamp(7rem,13vw,10rem)] pb-[clamp(5rem,11vw,9rem)]">
      <nav aria-label="Ruta" className="text-nota text-grafia-suave">
        <Link to="/catalogo" className="vinculo">
          Las piezas
        </Link>
        <span className="mx-3 opacity-70" aria-hidden="true">
          /
        </span>
        <span className="text-grafia/85">Pedido</span>
      </nav>

      <h1 className="mt-7 text-portada text-grafia">Completar el pedido</h1>

      <div className="mt-9 border-y filete py-5">
        <Pasos actual={paso} alVolverA={setPaso} />
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
        <div>
          <h2
            ref={encabezadoPaso}
            tabIndex={-1}
            className="text-titulo text-grafia outline-none"
          >
            {PASOS[paso].titulo}
          </h2>

          {/* ── Contacto ────────────────────────────────────────────── */}
          {actual === 'contacto' && (
            <div className="mt-9 grid gap-7 sm:grid-cols-2">
              <CampoTexto
                etiqueta="Nombre"
                autoComplete="given-name"
                valor={datos.nombre}
                alCambiar={campo('nombre')}
                error={errores.nombre}
              />
              <CampoTexto
                etiqueta="Apellido"
                autoComplete="family-name"
                valor={datos.apellido}
                alCambiar={campo('apellido')}
                error={errores.apellido}
              />
              <CampoTexto
                etiqueta="Correo"
                type="email"
                autoComplete="email"
                valor={datos.email}
                alCambiar={campo('email')}
                error={errores.email}
                ayuda="Aquí enviamos el certificado y el seguimiento de la pieza."
                className="sm:col-span-2"
              />
              <CampoTexto
                etiqueta="Teléfono"
                type="tel"
                autoComplete="tel"
                valor={datos.telefono}
                alCambiar={campo('telefono')}
                error={errores.telefono}
                className="sm:col-span-2"
              />
            </div>
          )}

          {/* ── Entrega ─────────────────────────────────────────────── */}
          {actual === 'entrega' && (
            <div className="mt-9">
              <GrupoOpciones
                etiqueta="Cómo quiere recibirla"
                valor={datos.modoEntrega}
                alCambiar={campo('modoEntrega')}
                opciones={ENTREGAS}
              />

              {datos.modoEntrega === 'envio' ? (
                <div className="mt-9 grid gap-7 sm:grid-cols-2">
                  <CampoSelect
                    etiqueta="País"
                    valor={datos.pais}
                    alCambiar={campo('pais')}
                    opciones={PAISES}
                  />
                  <CampoTexto
                    etiqueta="Ciudad"
                    autoComplete="address-level2"
                    valor={datos.ciudad}
                    alCambiar={campo('ciudad')}
                    error={errores.ciudad}
                  />
                  <CampoTexto
                    etiqueta="Dirección"
                    autoComplete="street-address"
                    valor={datos.direccion}
                    alCambiar={campo('direccion')}
                    error={errores.direccion}
                    className="sm:col-span-2"
                  />
                  <CampoTexto
                    etiqueta="Apartamento, torre, indicaciones"
                    opcional
                    valor={datos.detalle}
                    alCambiar={campo('detalle')}
                    className="sm:col-span-2"
                  />
                  <CampoTexto
                    etiqueta="Notas para el taller"
                    opcional
                    valor={datos.notas}
                    alCambiar={campo('notas')}
                    ayuda="Si la pieza es un regalo, díganoslo: la preparamos sin documentos de precio."
                    className="sm:col-span-2"
                  />
                </div>
              ) : (
                <div className="mt-9 border filete p-7">
                  <p className="versalita text-nota text-acento">Taller Montesacro</p>
                  <p className="prosa mt-4 text-menor leading-relaxed text-grafia-suave">
                    Le escribimos dentro de las 24 horas siguientes para acordar día y hora.
                    La visita dura cerca de media hora: revisamos el grabado, el número de
                    serie y le explicamos el mantenimiento de la piel.
                  </p>
                  <CampoTexto
                    etiqueta="Días u horas que le convienen"
                    opcional
                    valor={datos.notas}
                    alCambiar={campo('notas')}
                    className="mt-7"
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Pago ────────────────────────────────────────────────── */}
          {actual === 'pago' && (
            <div className="mt-9">
              <GrupoOpciones
                etiqueta="Forma de pago"
                valor={datos.metodoPago}
                alCambiar={campo('metodoPago')}
                opciones={
                  datos.modoEntrega === 'envio'
                    ? PAGOS.filter((p) => p.valor !== 'taller')
                    : PAGOS
                }
              />

              {datos.metodoPago === 'tarjeta' && (
                <div className="mt-9">
                  <AvisoPrototipo />

                  {/* Cada campo va con `autoComplete="off"` y sin los nombres
                      `cc-*`: no queremos que el navegador ofrezca una tarjeta
                      guardada de verdad en un formulario de mentira. */}
                  <div className="mt-7 grid gap-7 sm:grid-cols-2">
                    <CampoTexto
                      etiqueta="Número de tarjeta"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="0000 0000 0000 0000"
                      valor={datos.tarjeta}
                      alCambiar={(v) => campo('tarjeta')(formatearTarjeta(v))}
                      error={errores.tarjeta}
                      className="sm:col-span-2"
                    />
                    <CampoTexto
                      etiqueta="Titular"
                      autoComplete="off"
                      valor={datos.titular}
                      alCambiar={campo('titular')}
                      error={errores.titular}
                      className="sm:col-span-2"
                    />
                    <CampoTexto
                      etiqueta="Caducidad"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="MM/AA"
                      valor={datos.caducidad}
                      alCambiar={(v) => campo('caducidad')(formatearCaducidad(v))}
                      error={errores.caducidad}
                    />
                    <CampoTexto
                      etiqueta="CVV"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000"
                      maxLength={4}
                      valor={datos.cvv}
                      alCambiar={(v) => campo('cvv')(digitos(v).slice(0, 4))}
                      error={errores.cvv}
                    />
                  </div>
                </div>
              )}

              {datos.metodoPago !== 'tarjeta' && (
                <p className="mt-9 border filete px-5 py-4 text-menor leading-relaxed text-grafia-suave">
                  {datos.metodoPago === 'transferencia'
                    ? 'Al confirmar le enviamos los datos de la cuenta por correo. La pieza entra a producción cuando se recibe la transferencia.'
                    : 'Se paga en el taller, al recibir la pieza. No pedimos ningún dato bancario ahora.'}
                </p>
              )}
            </div>
          )}

          {/* ── Revisión ────────────────────────────────────────────── */}
          {actual === 'revision' && (
            <div className="mt-9 space-y-8">
              {[
                {
                  titulo: 'Contacto',
                  paso: 0,
                  filas: [
                    ['Nombre', `${datos.nombre} ${datos.apellido}`],
                    ['Correo', datos.email],
                    ['Teléfono', datos.telefono],
                  ],
                },
                {
                  titulo: 'Entrega',
                  paso: 1,
                  filas:
                    datos.modoEntrega === 'taller'
                      ? [
                          ['Modo', 'Retiro en el taller, con cita'],
                          ['Preferencia', datos.notas || 'Sin preferencia'],
                        ]
                      : [
                          ['Modo', 'Envío asegurado'],
                          ['Dirección', [datos.direccion, datos.detalle].filter(Boolean).join(', ')],
                          [
                            'Ciudad',
                            `${datos.ciudad}, ${PAISES.find((p) => p.valor === datos.pais)?.texto}`,
                          ],
                          ['Notas', datos.notas || 'Ninguna'],
                        ],
                },
                {
                  titulo: 'Pago',
                  paso: 2,
                  filas: [
                    ['Forma', PAGOS.find((p) => p.valor === datos.metodoPago)?.texto],
                    ...(datos.metodoPago === 'tarjeta'
                      ? [
                          ['Tarjeta', `···· ${digitos(datos.tarjeta).slice(-4)}`],
                          ['Titular', datos.titular],
                        ]
                      : []),
                  ],
                },
              ].map((bloque) => (
                <section key={bloque.titulo} className="border-t filete pt-6">
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="versalita text-nota text-acento">{bloque.titulo}</h3>
                    <button
                      type="button"
                      onClick={() => setPaso(bloque.paso)}
                      className="vinculo text-nota text-grafia-suave transition-colors duration-300 hover:text-grafia"
                    >
                      Modificar
                    </button>
                  </div>

                  <dl className="mt-4">
                    {bloque.filas.map(([clave, valor]) => (
                      <div
                        key={clave}
                        className="flex items-baseline justify-between gap-6 py-1.5"
                      >
                        <dt className="shrink-0 text-nota text-grafia-suave">{clave}</dt>
                        <dd className="text-right text-menor text-grafia">{valor}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <p className="border-t filete pt-6 text-nota leading-relaxed text-grafia-suave">
                Al confirmar, la pieza entra a la cola de producción del taller y se le
                asigna su número de serie. Prototipo: no se cobra nada ni se envía ningún
                dato a ningún servidor.
              </p>
            </div>
          )}

          {/* ── Navegación entre pasos ──────────────────────────────── */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            {paso === PASOS.length - 1 ? (
              <button
                type="button"
                onClick={confirmar}
                className="versalita border border-acento px-9 py-4.5 text-menor text-grafia transition-colors duration-500 hover:bg-realce"
              >
                Confirmar el pedido
              </button>
            ) : (
              <button
                type="button"
                onClick={avanzar}
                className="versalita border border-acento px-9 py-4.5 text-menor text-grafia transition-colors duration-500 hover:bg-realce"
              >
                Continuar
              </button>
            )}

            {paso > 0 && (
              <button
                type="button"
                onClick={retroceder}
                className="versalita text-menor text-grafia-suave transition-colors duration-300 hover:text-grafia"
              >
                Volver
              </button>
            )}
          </div>
        </div>

        <ResumenPedido
          lineas={resumen.lineas}
          piezas={resumen.piezas}
          className="lg:sticky lg:top-[6.5rem] lg:self-start"
        />
      </div>
    </section>
  )
}
