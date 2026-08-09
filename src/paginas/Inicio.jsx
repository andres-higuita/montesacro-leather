import HeroLupa from '../components/portada/HeroLupa'
import Manifiesto from '../components/portada/Manifiesto'
import Pieles from '../components/portada/Pieles'
import ElInterior from '../components/portada/ElInterior'
import Ficha from '../components/portada/Ficha'
import Empaque from '../components/portada/Empaque'
import Cierre from '../components/portada/Cierre'
import RecorridoScrub from '../components/producto/RecorridoScrub'
import { CAPITULOS_VUELTA, VUELTA, VUELTA_VERTICAL } from '../lib/secuencia'

/**
 * La portada: una sola pieza, contada de arriba abajo.
 *
 * Siete bloques, y el ritmo lo pone la alternancia de campo:
 *
 *   01 Portada    obsidiana   iris + lupa
 *   02 Argumento  vinotinto   texto que se enciende
 *   03 Recorrido  obsidiana   scrub de 120 fotogramas
 *   04 Pieles     obsidiana   selector en vivo
 *   05 Interior   obsidiana   empuje de cámara sobre fotografía
 *   06 Ficha      marfil      quieta
 *   07 Empaque    verde       quieto
 *   —  Cierre     obsidiana   la llamada
 *
 * MOVIMIENTO: hay exactamente cuatro sitios donde algo se mueve con el scroll
 * —portada, argumento, recorrido e interior—, y en los cuatro el movimiento ES
 * el contenido. Las secciones de datos están quietas a propósito: un dato que
 * entra fundiéndose se lee como publicidad; uno que simplemente está, como
 * certificado. Esa es toda la regla.
 */
export default function Inicio() {
  return (
    <>
      <HeroLupa />
      <Manifiesto />

      {/* El recorrido maestro. La pieza gira de tres cuartos a frontal y la
          piel pasa de marfil a vinotinto dentro del mismo plano: por eso abre
          el bloque de las pieles en lugar de cerrarlo.

          `anchoPlaca`: el metraje es de 1200 px de ancho. A sangre en una
          pantalla retina se ampliaría tres veces y el relieve de caimán se
          deshace. Dibujado a su tamaño, centrado sobre el obsidiana, se ve
          nítido en vez de grande. */}
      <RecorridoScrub
        id="recorrido"
        secuencia={VUELTA}
        secuenciaVertical={VUELTA_VERTICAL}
        capitulos={CAPITULOS_VUELTA}
        recorrido={4}
        anchoPlaca={1100}
        nitidez={2}
        alt="El bolso de mano girando de tres cuartos a frontal, con la piel pasando de marfil a vinotinto"
      />

      <Pieles />
      <ElInterior />
      <Ficha />
      <Empaque />
      <Cierre />
    </>
  )
}
