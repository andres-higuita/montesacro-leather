import HeroLupa from '../components/portada/HeroLupa'
import Variantes from '../components/portada/Variantes'
import ElInterior from '../components/portada/ElInterior'
import Ficha from '../components/portada/Ficha'
import Empaque from '../components/portada/Empaque'
import Cierre from '../components/portada/Cierre'
import RecorridoScrub from '../components/producto/RecorridoScrub'
import { CAPITULOS_VUELTA, VUELTA, VUELTA_VERTICAL } from '../lib/secuencia'

/**
 * La portada: una sola pieza, contada de arriba abajo.
 *
 * Seis bloques, y el ritmo lo pone la alternancia de campo:
 *
 *   01 Portada    obsidiana   iris + lente
 *   02 Pieles     marfil      bloque fijado, cuatro pieles en relevo
 *   03 Recorrido  obsidiana   scrub de 120 fotogramas
 *   04 Interior   obsidiana   empuje de cámara sobre fotografía
 *   05 Ficha      marfil      quieta
 *   06 Empaque    verde       quieto
 *   —  Cierre     obsidiana   la llamada
 *
 * EL PRODUCTO ABRE. Portada y pieles son los dos primeros bloques a propósito:
 * quien acaba de ver la pieza aparecer dentro de la lente quiere ver la pieza.
 * Lo que había en medio —una frase de manifiesto sobre banda vinotinto— se
 * quitó por eso mismo.
 *
 * MOVIMIENTO: cuatro sitios donde algo se mueve con el scroll —portada, pieles,
 * recorrido e interior—, y en los cuatro el movimiento ES el contenido. Las
 * secciones de datos están quietas a propósito: un dato que entra fundiéndose
 * se lee como publicidad; uno que simplemente está, como certificado.
 */
export default function Inicio() {
  return (
    <>
      <HeroLupa />

      {/* Las pieles van INMEDIATAMENTE después de la portada. Aquí había un
          manifiesto —una frase grande sobre banda vinotinto— y se quitó: quien
          acaba de ver la pieza aparecer dentro de la lente quiere ver la pieza,
          no leer sobre la casa. El argumento de marca no se perdió; vive en la
          ficha técnica y en el bloque del empaque, donde va respaldado por
          cifras en vez de por adjetivos. */}
      <Variantes />

      {/* El recorrido maestro. La pieza gira de tres cuartos a frontal y la
          piel va cambiando dentro del mismo plano: es la demostración en
          movimiento de lo que el bloque anterior acaba de enseñar quieto.

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

      <ElInterior />
      <Ficha />
      <Empaque />
      <Cierre />
    </>
  )
}
