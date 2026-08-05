import { useCallback, useMemo, useState } from 'react'
import { CarritoContexto, claveDeLinea } from './contexto'

/**
 * Estado del carrito. SOLO UI.
 *
 * No persiste, no llama a ninguna API y no calcula totales: el prototipo
 * existe para validar el flujo, no para vender. Cuando exista backend, este
 * archivo es el único punto donde se enchufa (o se reemplaza por el carrito
 * de Shopify).
 */
export function ProveedorCarrito({ children }) {
  const [lineas, setLineas] = useState([])
  const [abierto, setAbierto] = useState(false)

  /* `cantidad` llega del selector de la barra flotante. Se valida el tipo
     porque los botones que llaman a esto sin argumento pasan el evento de clic
     como primer parámetro heredado, y `1` es siempre la lectura correcta. */
  const agregar = useCallback((linea, cantidad = 1) => {
    const unidades = Number.isInteger(cantidad) && cantidad > 0 ? cantidad : 1
    const clave = claveDeLinea(linea)
    setLineas((previas) => {
      const existente = previas.find((l) => claveDeLinea(l) === clave)
      if (existente) {
        return previas.map((l) =>
          claveDeLinea(l) === clave ? { ...l, cantidad: l.cantidad + unidades } : l,
        )
      }
      return [...previas, { ...linea, cantidad: unidades }]
    })
    setAbierto(true)
  }, [])

  const quitar = useCallback((clave) => {
    setLineas((previas) => previas.filter((l) => claveDeLinea(l) !== clave))
  }, [])

  const cambiarCantidad = useCallback((clave, delta) => {
    setLineas((previas) =>
      previas
        .map((l) =>
          claveDeLinea(l) === clave ? { ...l, cantidad: Math.max(0, l.cantidad + delta) } : l,
        )
        .filter((l) => l.cantidad > 0),
    )
  }, [])

  const vaciar = useCallback(() => {
    setLineas([])
    setAbierto(false)
  }, [])

  const valor = useMemo(() => {
    const piezas = lineas.reduce((suma, l) => suma + l.cantidad, 0)
    return {
      lineas,
      piezas,
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
      claveDeLinea,
    }
  }, [lineas, abierto, agregar, quitar, cambiarCantidad, vaciar])

  return <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>
}
