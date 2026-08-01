import { createContext, useContext, useEffect } from 'react'

/**
 * Mundo de la banda que cada página tiene DEBAJO del encabezado flotante.
 *
 * El encabezado es `fixed` y arranca sin fondo, así que hereda los roles de
 * color del tema y no los del contenido que tiene detrás. En una página cuya
 * primera banda es `mundo-vino` (oscura en los dos temas), con el tema claro
 * eso deja tinta oscura sobre vinotinto: el encabezado desaparece hasta que
 * aparece el fondo al hacer scroll.
 *
 * Cada página declara su banda superior y el encabezado adopta esos roles
 * mientras está en reposo.
 */
export const CabeceraContexto = createContext(null)

export function useCabecera() {
  return useContext(CabeceraContexto) ?? { mundo: 'base', declarar: () => {} }
}

/**
 * Declara el mundo de la banda superior de la página actual.
 * Al desmontar vuelve a `base`.
 *
 * @param {'base' | 'contra' | 'vino'} mundo
 */
export function useMundoDeCabecera(mundo) {
  const { declarar } = useCabecera()

  useEffect(() => {
    declarar(mundo)
    return () => declarar('base')
  }, [declarar, mundo])
}
