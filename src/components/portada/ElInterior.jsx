import RecorridoScrub from '../producto/RecorridoScrub'
import { CAPITULOS_INTERIOR, INTERIOR } from '../../lib/secuencia'

/**
 * El interior: la pieza se abre mientras se baja.
 *
 * Es el único bloque de la portada donde el producto se mueve de verdad —el de
 * las pieles cambia de material, pero cada pieza está quieta—, y es el que
 * justifica el gesto: entre cerrado y abierto hay dos siluetas distintas, y eso
 * la fotografía fija no lo puede fingir. Montando dos tomas se ve el truco.
 *
 * COMO PLACA Y NO A SANGRE. El metraje mide 1200 px de ancho y está rodado
 * sobre el ciclorama cálido del plató, no sobre el obsidiana de la sección. A
 * sangre pasarían dos cosas malas: en una pantalla retina se ampliaría casi
 * tres veces y el relieve de caimán se deshace, y el fondo del plató invadiría
 * la sección entera. Dibujado a su tamaño, centrado y con las esquinas
 * redondeadas de la casa, se lee como una lámina de catálogo —que es lo que
 * es— y se ve nítido en vez de grande.
 *
 * `RecorridoScrub` pone el resto: canvas en vez de `<video>`, descarga diferida
 * hasta que el bloque está a una pantalla, relleno con el negro real del
 * fotograma y, con `prefers-reduced-motion`, un fotograma quieto con los
 * capítulos en columna.
 */
export default function ElInterior() {
  return (
    <RecorridoScrub
      id="interior"
      secuencia={INTERIOR}
      capitulos={CAPITULOS_INTERIOR}
      /* Cinco pantallas de recorrido para 240 fotogramas: 48 por pantalla, que
         es lo máximo que se puede estirar este clip antes de que se vea a
         saltos al arrastrar hacia atrás. Ver `secuencia.js`. */
      recorrido={5}
      /* Casi el doble del suavizado de la casa. Es lo que convierte el gesto de
         «enganchado al dedo» en «algo con peso que se abre solo». */
      suavizado={0.9}
      /* El clip está rodado sobre NEGRO, no sobre el plató cálido. Eso cambia
         el armado: la placa ya no tiene por qué leerse como una lámina dentro
         de la sección, porque su fondo y el de la sección son el mismo color.
         Con los bordes disueltos al 11 %, el canto desaparece del todo y el
         metraje se comporta como si fuera a sangre —pero sin ampliarlo por
         encima de sus 1280 px, que es lo que deshacía el relieve. */
      anchoPlaca={1280}
      desvanecer={11}
      nitidez={2}
      alt="La cámara se acerca al bolso de mano mientras la solapa se abre: aparece el forro de ante vinotinto, el bolsillo con cremallera y la placa MONTESACRO cosida"
    />
  )
}
