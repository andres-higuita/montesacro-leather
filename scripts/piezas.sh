#!/usr/bin/env bash
#
# Corta el metraje de la portada en el material de cada pieza.
#
#   ./scripts/piezas.sh [archivo.mp4]
#
# El metraje maestro es un plano continuo de 10 s que recorre el neceser
# (3.45-6.05), el tarjetero (6.05-7.55) y termina con el bodegón de las tres
# piezas (7.55-10.0). Los primeros segundos son una pieza plana con cierre
# perimetral que NO corresponde al bolso de mano del catálogo —el bolso lleva
# asa sobre anclajes de zamak y esa no la tiene—, así que de ese tramo solo se
# aprovecha el macro de la escama, que es material y no silueta.
#
# De cada tramo salen tres cosas:
#
#   public/piezas/<id>/hero.mp4     clip de la portada de la ficha
#   public/piezas/<id>/poster.jpg   primer fotograma, para el <video poster>
#   public/piezas/<id>/scrub-####.jpg  fotogramas del recorrido ligado al scroll
#
# Los números de fotogramas que imprime al terminar van en src/data/escenas.js.
#
# Si algún día hay metraje propio por pieza, este script deja de hacer falta:
# basta con dejar los archivos en esas mismas rutas.

set -euo pipefail

VIDEO="${1:-public/portada.mp4}"
[ -f "$VIDEO" ] || { echo "No existe: $VIDEO" >&2; exit 1; }

command -v ffmpeg >/dev/null || { echo "Falta ffmpeg (brew install ffmpeg)" >&2; exit 1; }

# --- Tramos: id  inicio  duración  inicio-portada  duración-portada ---------
#
# Los dos primeros números son el tramo COMPLETO de la pieza: el que se recorre
# con el scroll. Los dos últimos son el trozo que se reproduce en la portada de
# la ficha, y son un plano DISTINTO del que abre el recorrido a propósito. Con
# el mismo, la ficha enseñaba dos veces la misma imagen a media pantalla de
# distancia y el recorrido perdía todo el efecto de revelación.
#
# El clip de portada NO va en bucle: se reproduce una vez y se queda en su
# último fotograma. Ese fotograma es el que se mira durante minutos, así que
# cada tramo de portada termina en una piel que la pieza tenga de verdad en
# catálogo — el tarjetero acaba abierto, antes de que el plano se abra al
# bodegón de las tres piezas.
#
# El corte se decidió mirando el metraje fotograma a fotograma:
#   0.00-1.45  macro de la escama          → recorrido del bolso (solo material)
#   1.45-3.45  la pieza plana, en cuatro tonos → sin uso: silueta que no es
#              la del bolso de catálogo
#   3.45-5.10  neceser marfil y negro      → abre el recorrido del neceser
#   5.05-5.90  neceser marfil y vinotinto  → portada del neceser
#   6.05-6.85  tarjetero cerrado           → abre el recorrido del tarjetero
#   6.20-6.65  tarjetero abierto en verde  → portada del tarjetero
#   7.55-10.0  bodegón de las tres piezas  → cierre de todas las fichas
TRAMOS=(
  "bolso-de-mano 0.00 1.45 0.95 0.50"
  "neceser       3.45 2.60 5.05 0.85"
  "tarjetero     6.05 1.50 6.20 0.45"
  "bodegon       7.55 2.40 7.55 2.40"
)

# 15 fps: el ritmo lo pone el scroll, no un reproductor. Ancho 1440 y calidad 5
# dejan cada fotograma en ~60 KB — una secuencia entera pesa menos que el mp4.
FPS="${FPS:-15}"
ANCHO_SCRUB="${ANCHO_SCRUB:-1440}"

rm -rf public/piezas
for tramo in "${TRAMOS[@]}"; do
  read -r ID INICIO DURACION INICIO_PORTADA DURACION_PORTADA <<<"$tramo"
  DESTINO="public/piezas/$ID"
  mkdir -p "$DESTINO"

  # Clip de portada. `-ss` antes de `-i` busca por keyframe, así que se
  # recodifica entero: los tramos son cortos y el corte tiene que ser exacto.
  ffmpeg -loglevel error -y -ss "$INICIO_PORTADA" -t "$DURACION_PORTADA" -i "$VIDEO" \
    -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
    -movflags +faststart \
    "$DESTINO/hero.mp4"

  # El póster es el PRIMER fotograma del clip de portada, no el del recorrido:
  # es lo que se ve mientras el vídeo carga y con movimiento reducido.
  ffmpeg -loglevel error -y -ss "$INICIO_PORTADA" -i "$VIDEO" -frames:v 1 -q:v 3 \
    "$DESTINO/poster.jpg"

  ffmpeg -loglevel error -y -ss "$INICIO" -t "$DURACION" -i "$VIDEO" \
    -vf "fps=${FPS},scale=${ANCHO_SCRUB}:-2:flags=lanczos" -q:v 5 \
    "$DESTINO/scrub-%04d.jpg"

  TOTAL=$(find "$DESTINO" -name 'scrub-*.jpg' | wc -l | tr -d ' ')
  PESO=$(du -sh "$DESTINO" | cut -f1)
  printf '  %-14s fotogramas: %-4s peso: %s\n' "$ID" "$TOTAL" "$PESO"
done


# --- Fotografías de piel: nombre  segundo ----------------------------------
#
# El metraje enseña algunas de las pieles del catálogo en plano fijo. Esas
# tomas son material REAL de la marca, así que sustituyen al marcador de
# posición en el bloque de pieles: mezclar un fotograma del taller con una foto
# de banco de imágenes en la misma fila delata las dos.
#
# Las pieles que el metraje no cubre —café oscuro, azul marino— siguen con
# marcador de posición en src/data/imagenes.js hasta que haya fotografía.
STILLS=(
  "neceser-negro            4.20"
  "neceser-vinotinto        5.95"
  "tarjetero-verde-botella  6.62"
  "tarjetero-vinotinto      7.25"
)

mkdir -p public/fotos
for still in "${STILLS[@]}"; do
  read -r NOMBRE SEGUNDO <<<"$still"
  ffmpeg -loglevel error -y -ss "$SEGUNDO" -i "$VIDEO" -frames:v 1 \
    -vf "scale=1600:-2:flags=lanczos" -q:v 3 \
    "public/fotos/$NOMBRE.jpg"
  printf '  %-24s %s\n' "$NOMBRE.jpg" "$(du -h "public/fotos/$NOMBRE.jpg" | cut -f1)"
done

echo
echo 'Los totales van en src/data/escenas.js, campo secuencia.total de cada pieza.'
