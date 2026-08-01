/** Normaliza un campo de inicial: una sola letra, en mayúscula. */
export const soloLetra = (valor) =>
  valor
    .replace(/[^\p{L}]/gu, '')
    .slice(-1)
    .toUpperCase()
