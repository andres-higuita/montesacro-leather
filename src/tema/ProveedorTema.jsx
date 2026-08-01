import { useCallback, useEffect, useMemo, useState } from 'react'
import { LLAVE_TEMA, TEMA_POR_DEFECTO, TEMAS, TemaContexto } from './contexto'

/**
 * Tema activo del prototipo.
 *
 * HERRAMIENTA DE REVISIÓN, no una preferencia de producto. Existe para poder
 * comparar la dirección clara (arcilla) contra la oscura (piel) sobre la misma
 * maqueta. Cuando se decida una, se borra este proveedor, se deja la clase del
 * tema ganador fija en `index.html` y no cambia una sola línea de componente:
 * todos consumen roles de color, no colores.
 */
export function ProveedorTema({ children }) {
  const [tema, setTema] = useState(() => {
    if (typeof window === 'undefined') return TEMA_POR_DEFECTO
    const guardado = window.localStorage.getItem(LLAVE_TEMA)
    return TEMAS[guardado] ? guardado : TEMA_POR_DEFECTO
  })

  useEffect(() => {
    const raiz = document.documentElement
    Object.values(TEMAS).forEach((t) => raiz.classList.remove(t.clase))
    raiz.classList.add(TEMAS[tema].clase)
    raiz.style.colorScheme = tema === 'piel' ? 'dark' : 'light'
    window.localStorage.setItem(LLAVE_TEMA, tema)
  }, [tema])

  const cambiar = useCallback((id) => {
    if (TEMAS[id]) setTema(id)
  }, [])

  const valor = useMemo(() => ({ tema, cambiar, temas: Object.values(TEMAS) }), [tema, cambiar])

  return <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>
}
