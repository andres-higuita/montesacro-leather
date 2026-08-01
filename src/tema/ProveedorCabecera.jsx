import { useCallback, useMemo, useState } from 'react'
import { CabeceraContexto } from './cabecera'

/** Ver `cabecera.js` para el porqué. */
export function ProveedorCabecera({ children }) {
  const [mundo, setMundo] = useState('base')

  const declarar = useCallback((siguiente) => setMundo(siguiente), [])
  const valor = useMemo(() => ({ mundo, declarar }), [mundo, declarar])

  return <CabeceraContexto.Provider value={valor}>{children}</CabeceraContexto.Provider>
}
