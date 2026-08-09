import HeroLupa from '../components/portada/HeroLupa'
import Variantes from '../components/portada/Variantes'
import ElInterior from '../components/portada/ElInterior'
import Ficha from '../components/portada/Ficha'
import Empaque from '../components/portada/Empaque'
import Cierre from '../components/portada/Cierre'

/**
 * La portada: una sola pieza, contada de arriba abajo.
 *
 * Cinco bloques, y el ritmo lo pone la alternancia de campo:
 *
 *   01 Portada    obsidiana   iris + lente
 *   02 Pieles     marfil      bloque fijado, cuatro pieles en relevo
 *   03 Interior   obsidiana   empuje de cámara sobre fotografía
 *   04 Ficha      marfil      quieta
 *   05 Empaque    verde       quieto
 *   —  Cierre     obsidiana   la llamada
 *
 * EL PRODUCTO ABRE. Portada y pieles son los dos primeros bloques a propósito:
 * quien acaba de ver la pieza aparecer dentro de la lente quiere ver la pieza.
 *
 * DOS BLOQUES SE QUITARON, y por el mismo motivo: no añadían. Un manifiesto
 * sobre banda vinotinto entre la portada y las pieles, y un recorrido de 120
 * fotogramas después. El segundo repetía el argumento del bloque de pieles
 * —la misma horma en cuatro materiales— y cobraba cuatro pantallas por ello.
 *
 * MOVIMIENTO: tres sitios donde algo se mueve con el scroll —portada, pieles e
 * interior—, y en los tres el movimiento ES el contenido. Las secciones de
 * datos están quietas a propósito: un dato que entra fundiéndose se lee como
 * publicidad; uno que simplemente está, como certificado.
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

      {/* Aquí iba el recorrido de 120 fotogramas ligado al scroll: la pieza
          girando de tres cuartos a frontal mientras cambiaba de piel. Se quitó
          porque decía lo mismo que el bloque anterior —las cuatro pieles sobre
          la misma horma— y le costaba al visitante casi cuatro pantallas más
          de scroll para no añadir nada. El componente sigue vivo en la ficha de
          producto, que es donde ese recorrido sí cuenta algo nuevo. */}
      <ElInterior />
      <Ficha />
      <Empaque />
      <Cierre />
    </>
  )
}
