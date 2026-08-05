#!/usr/bin/env bash
#
# Encadena los cuatro clips de la pieza —uno por piel— en UN solo recorrido
# ligado al scroll.
#
#   ./scripts/bolso-vueltas.sh negro.mp4 verde.mp4 marfil.mp4 vinotinto.mp4
#
# El guion que produce:
#
#   negro da la vuelta y se abre → verde da la vuelta y se abre →
#   marfil → vinotinto
#
# POR QUÉ EL CAMBIO DE COLOR NO SE VE
# Cada clip se genera con la MISMA foto como primer y último fotograma
# (`<color>-cerrado.jpg`), así que los cuatro empiezan y acaban en idéntica
# pose: cerrado, de frente. El empalme entre dos clips es entonces un fundido
# entre dos imágenes iguales salvo el tono de la piel, y eso no se lee como un
# corte: se lee como la misma pieza cambiando de piel. Es el mismo principio que
# el montaje de fotos fijas, pero con la pieza girando.
#
# Si un clip NO vuelve a su pose inicial, el empalme se va a notar. Se ve a ojo
# comparando su primer y su último fotograma; el script los deja en
# `<temporal>/cotejo-<n>-{inicio,fin}.jpg` y avisa por pantalla.
#
# Variables:
#   FPS=12       fotogramas por segundo de la secuencia
#   CALIDAD=7    -q:v de JPEG (2 mejor, 31 peor)
#   FUNDIDO=0.6  segundos de fundido entre piel y piel
#   RECORTE=…    filtro delogo para la marca de agua del generador, p. ej.
#                RECORTE='delogo=x=1130:y=570:w=60:h=60'
#
# Al terminar imprime dos cosas que van a mano en src/data/escenas.js:
#   - `secuencia.total`
#   - las marcas `en` de los capítulos, una por piel, ya calculadas

set -euo pipefail

command -v ffmpeg >/dev/null || { echo "Falta ffmpeg (brew install ffmpeg)" >&2; exit 1; }
[ "$#" -eq 4 ] || {
  echo "Uso: ./scripts/bolso-vueltas.sh <negro.mp4> <verde.mp4> <marfil.mp4> <vinotinto.mp4>" >&2
  exit 1
}

DESTINO="${DESTINO:-public/piezas/bolso-de-mano}"
TEMP=$(mktemp -d)
trap 'rm -rf "$TEMP"' EXIT

# El cotejo de poses NO va al temporal: hay que poder mirarlo después de que el
# script termine.
COTEJO="${TMPDIR:-/tmp}/bolso-cotejo"
rm -rf "$COTEJO"
mkdir -p "$COTEJO"

FPS="${FPS:-12}"
CALIDAD="${CALIDAD:-7}"
FUNDIDO="${FUNDIDO:-0.6}"
ANCHO=1200
ALTO=674

PIELES=(negro verde-botella marfil vinotinto)

# --- Normalizar cada clip -----------------------------------------------------
# Todos al mismo tamaño, fps y base de tiempo antes de encadenar: si uno entra a
# 24 fps y otro a 30, `xfade` descarta fotogramas y el fundido sale a tirones.
ENTRADAS=()
CADENA=""
DURACIONES=()

echo "Clips:"
for ((i = 0; i < 4; i++)); do
  ORIGEN="${@:i+1:1}"
  [ -f "$ORIGEN" ] || { echo "No existe: $ORIGEN" >&2; exit 1; }

  CLIP="$TEMP/clip-$i.mp4"
  ffmpeg -loglevel error -y -i "$ORIGEN" \
    -vf "${RECORTE:+$RECORTE,}fps=${FPS},scale=${ANCHO}:-2:flags=lanczos,crop=${ANCHO}:${ALTO}" \
    -an -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p "$CLIP"

  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$CLIP")
  DURACIONES+=("$DUR")

  # Cotejo: primer y último fotograma del clip, para comprobar a ojo que la
  # pieza vuelve a su pose. De eso depende que el empalme sea invisible.
  ffmpeg -loglevel error -y -i "$CLIP" -frames:v 1 -q:v 3 \
    "$COTEJO/${PIELES[i]}-1-inicio.jpg"
  ffmpeg -loglevel error -y -sseof -0.1 -i "$CLIP" -frames:v 1 -q:v 3 \
    "$COTEJO/${PIELES[i]}-2-fin.jpg"

  ENTRADAS+=(-i "$CLIP")
  CADENA+="[${i}:v]settb=AVTB,fps=${FPS},format=yuv420p[v${i}];"
  printf '  %-14s %ss  %s\n' "${PIELES[i]}" "$(printf '%.1f' "$DUR")" "$(basename "$ORIGEN")"
done

# --- Encadenar con fundidos en la pose compartida -----------------------------
FIN="${DURACIONES[0]}"
PREV="[v0]"
# Las marcas van en SEGUNDOS de la línea de tiempo; al final se dividen por la
# duración total. La primera medio segundo dentro, no en cero: en el fotograma
# uno el rótulo aún no tiene nada que rotular.
MARCAS=(0.5)
for ((k = 1; k < 4; k++)); do
  OFFSET=$(awk -v f="$FIN" -v d="$FUNDIDO" 'BEGIN{printf "%.3f", f - d}')
  CADENA+="${PREV}[v${k}]xfade=transition=fade:duration=${FUNDIDO}:offset=${OFFSET}[x${k}];"
  PREV="[x${k}]"
  FIN=$(awk -v o="$OFFSET" -v t="${DURACIONES[k]}" 'BEGIN{printf "%.3f", o + t}')
  # La marca del capítulo va justo después de que el fundido termine: así el
  # rótulo entra cuando la piel nueva ya manda sola en pantalla.
  MARCAS+=("$(awk -v o="$OFFSET" -v d="$FUNDIDO" 'BEGIN{printf "%.3f", o + d}')")
done

DURACION_TOTAL=$FIN
CADENA+="${PREV}null[salida]"

mkdir -p "$DESTINO"
rm -f "$DESTINO"/scrub-*.jpg

ffmpeg -loglevel error -y "${ENTRADAS[@]}" \
  -filter_complex "$CADENA" -map "[salida]" \
  -q:v "$CALIDAD" "$DESTINO/scrub-%04d.jpg"

# --- WebP si se puede ---------------------------------------------------------
# Cuatro clips son el doble de fotogramas que un plano suelto, y en JPEG eso son
# más de veinte megas. WebP pesa la mitad a igual calidad visual. Si no está
# instalado (`brew install webp`) se queda en JPEG y el aviso sale por pantalla.
# Se comprueba que cwebp ARRANCA, no solo que existe: el paquete de Homebrew
# puede quedar instalado y roto por una dependencia que falta (`libtiff`), y
# entonces `command -v` dice que sí y el binario aborta. Los JPEG no se borran
# hasta que la conversión entera ha ido bien.
EXT=jpg
if cwebp -version >/dev/null 2>&1; then
  FALLO=0
  for F in "$DESTINO"/scrub-*.jpg; do
    cwebp -quiet -q 82 "$F" -o "${F%.jpg}.webp" || { FALLO=1; break; }
  done
  if [ "$FALLO" = 0 ]; then
    rm -f "$DESTINO"/scrub-*.jpg
    EXT=webp
  else
    rm -f "$DESTINO"/scrub-*.webp
    echo
    echo '· cwebp falló a mitad: la secuencia se queda en JPEG.' >&2
  fi
else
  echo
  echo '· Sin `cwebp` que funcione: la secuencia queda en JPEG y pesa el doble.'
  echo '  brew install webp libtiff  y volver a correr esto la deja en WebP.'
fi

TOTAL=$(find "$DESTINO" -name "scrub-*.$EXT" | wc -l | tr -d ' ')
PANTALLAS=$(awk -v t="$TOTAL" 'BEGIN{printf "%.1f", t / 56}')

echo
printf 'Recorrido: %s fotogramas · %s · %ss\n' \
  "$TOTAL" "$(du -ch "$DESTINO"/scrub-*."$EXT" | tail -1 | cut -f1)" "$DURACION_TOTAL"
echo
echo "En src/data/escenas.js, ESCENAS['bolso-de-mano']:"
printf '  ...material(\x27bolso-de-mano\x27, %s, \x27%s\x27),\n' "$TOTAL" "$EXT"
printf '  recorrido: %s,   // 56 fotogramas por pantalla\n' "$PANTALLAS"
echo '  capitulos: marcas `en` por piel ->'
for ((k = 0; k < 4; k++)); do
  EN=$(awk -v m="${MARCAS[k]}" -v t="$DURACION_TOTAL" 'BEGIN{printf "%.2f", m / t}')
  printf '    %-14s en: %s\n' "${PIELES[k]}" "$EN"
done
echo
echo "Cotejo de poses — el primer y el último fotograma de cada clip tienen que"
echo "ser la MISMA pose, o el empalme entre pieles se va a notar:"
printf '  %s\n' "$COTEJO"
