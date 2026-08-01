import { createContext, useContext } from 'react'

export const TEMAS = {
  arcilla: { id: 'arcilla', nombre: 'Arcilla', clase: 'tema-arcilla' },
  piel: { id: 'piel', nombre: 'Piel', clase: 'tema-piel' },
}

export const TEMA_POR_DEFECTO = 'arcilla'
export const LLAVE_TEMA = 'montesacro:tema'

export const TemaContexto = createContext(null)

export function useTema() {
  const contexto = useContext(TemaContexto)
  if (!contexto) throw new Error('useTema debe usarse dentro de <ProveedorTema>')
  return contexto
}
