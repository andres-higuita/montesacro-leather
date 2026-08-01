import { createContext, useContext } from 'react'

export const CarritoContexto = createContext(null)

/** Dos líneas son la misma si coinciden pieza, piel e iniciales. */
export const claveDeLinea = ({ productoId, colorway, iniciales }) =>
  `${productoId}::${colorway}::${iniciales ?? ''}`

export function useCarrito() {
  const contexto = useContext(CarritoContexto)
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  return contexto
}
