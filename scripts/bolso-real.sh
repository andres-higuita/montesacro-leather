#!/usr/bin/env bash
#
# Construye el recorrido del bolso a partir de la FOTOGRAFÍA REAL de la pieza.
#
#   ./scripts/bolso-real.sh
#
# Entra: las ocho tomas de estudio del clutch en public/fotos/bolso/
#        <colorway>-{cerrado,abierto}.jpg, mismo encuadre y misma luz en todas.
# Sale:  public/piezas/bolso-de-mano/scrub-####.jpg  (secuencia del scroll)
#        public/piezas/bolso-de-mano/poster.jpg      (primer fotograma)
#
# POR QUÉ SE PUEDE HACER ESTO CON OCHO FOTOS
# Las cuatro tomas cerradas comparten encuadre exacto, y las cuatro abiertas
# entre sí también. Un fundido cruzado entre dos tomas idénticas salvo el color
# de la piel no se lee como un corte: se lee como la MISMA pieza cambiando de
# piel. Eso es lo que hace Apple con sus acabados, y es la razón de que el
# guion sea cerrado→pieles→apertura→interiores y no una pasada de fotos.
#
# EL GUION (8.7 s → 104 fotogramas a 12 fps)
#   [01] negro cerrado, plano fijo         la pieza, antes de nada
#   [02] negro → verde → marfil → vinotinto   las cuatro pieles, en cerrado
#   [03] vinotinto cerrado → abierto       la apertura: aparece el forro
#   [04] vinotinto → marfil → verde → negro   los cuatro interiores
#
# El recorrido termina en negro abierto: el último fotograma es el que se queda
# en pantalla al soltar el bloque, y ahí se lee la placa MONTESACRO sobre el
# forro vinotinto. Es el mejor sitio donde dejar la vista.
#
# 12 fps y no 15: el ritmo lo pone el scroll, no un reproductor, y cada
# fotograma que sobra son 55 KB que el visitante descarga. A 12 fps el arrastre
# ya se lee continuo con el `scrub: 0.55` del componente.

set -euo pipefail

command -v ffmpeg >/dev/null || { echo "Falta ffmpeg (brew install ffmpeg)" >&2; exit 1; }

ORIGEN=public/fotos/bolso
DESTINO=public/piezas/bolso-de-mano
TEMP=$(mktemp -d)
trap 'rm -rf "$TEMP"' EXIT

# 12 fps da 105 fotogramas, que sobre 2.6 pantallas de scroll son unos 40 por
# pantalla. Apple, en la sección de rendimiento del MacBook Neo, va a 82 por
# pantalla (468 fotogramas repartidos en 5.7 pantallas). Ahí el hardware se
# mueve; aquí son fundidos lentos entre tomas fijas y 40 se leen continuos.
# Para acercarse a la densidad de Apple:  FPS=24 ./scripts/bolso-real.sh
# (el doble de fotogramas es el doble de peso: ~15 MB en vez de ~7).
FPS="${FPS:-12}"

# --- Modo vídeo: ./scripts/bolso-real.sh --video <archivo.mp4> --------------
#
# Cuando haya metraje de verdad del bolso —rodado, renderizado o generado desde
# estas mismas tomas con Veo/Gemini (el prompt vive en PROMPT-VIDEO-BOLSO.md)—
# no hay que montar nada: el vídeo YA es el plano continuo. Este modo solo lo
# corta en fotogramas en la misma ruta, con el mismo tamaño y el mismo fps, para
# que ni el componente ni escenas.js noten la diferencia (salvo el `total`).
if [ "${1:-}" = "--video" ]; then
  VIDEO="${2:?Uso: ./scripts/bolso-real.sh --video <archivo.mp4>}"
  [ -f "$VIDEO" ] || { echo "No existe: $VIDEO" >&2; exit 1; }

  mkdir -p "$DESTINO"
  rm -f "$DESTINO"/scrub-*.jpg

  # `RECORTE` queda a mano para la marca de agua que dejan algunos generadores.
  # Ejemplo:  RECORTE='delogo=x=1092:y=548:w=186:h=170' ./scripts/bolso-real.sh --video v.mp4
  # `CALIDAD` es el `-q:v` de JPEG (2 = mejor, 31 = peor). 5 para el montaje de
  # fotos; en un plano generado conviene 7: el grano fino que se pierde ahí no es
  # grano de piel real, es ruido del generador, y son dos megas menos.
  ffmpeg -loglevel error -y -i "$VIDEO" \
    -vf "${RECORTE:+$RECORTE,}fps=${FPS},scale=1200:-2:flags=lanczos,crop=1200:674" \
    -q:v "${CALIDAD:-5}" "$DESTINO/scrub-%04d.jpg"

  # WebP si está disponible: pesa la mitad a igual calidad visual, y una
  # secuencia son cientos de archivos. Si no está (`brew install webp`) se queda
  # en JPEG y el aviso sale por pantalla.
  # Se comprueba que cwebp ARRANCA, no solo que el archivo existe: el paquete de
  # Homebrew puede quedar instalado y roto por una dependencia que falta
  # (`libtiff`), y entonces `command -v` dice que sí y el binario aborta.
  # Los JPEG no se borran hasta que la conversión entera ha ido bien.
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
      echo '· cwebp falló a mitad: la secuencia se queda en JPEG.' >&2
    fi
  else
    echo '· Sin `cwebp` que funcione: la secuencia queda en JPEG y pesa el doble.'
    echo '  brew install webp libtiff  y volver a correr esto la deja en WebP.'
  fi

  # A propósito NO se toca poster.jpg: ese es el póster del vídeo de PORTADA
  # (`portada.jpg`/`hero.mp4`), que es otro plano. El recorrido no necesita
  # póster —`RecorridoScrub` pinta el primer fotograma en cuanto llega.
  TOTAL=$(find "$DESTINO" -name "scrub-*.$EXT" | wc -l | tr -d ' ')
  printf 'Recorrido desde vídeo: %s fotogramas · %s\n' \
    "$TOTAL" "$(du -ch "$DESTINO"/scrub-*."$EXT" | tail -1 | cut -f1)"
  printf "En src/data/escenas.js:  ...material('bolso-de-mano', %s, '%s'),\n" "$TOTAL" "$EXT"
  echo "Y revisa las marcas \`en\` de los capítulos: el guion del vídeo no es el de las fotos."
  exit 0
fi
# El plato se recorta a 16:9 y se entrega a 1200 px: el original mide 1280 px de
# ancho, así que el empuje de cámara (hasta 1.06×) sigue REDUCIENDO la imagen en
# vez de ampliarla. Ampliar una foto de estudio deshace el grano de la piel.
PLATO_W=1280
PLATO_H=720
SALIDA_W=1200
SALIDA_H=675
ZOOM=0.06

# --- Guion: archivo  duración  fundido-de-entrada  tipo --------------------
# La duración es lo que la toma manda en pantalla; el fundido es cuánto tarda en
# relevar a la anterior.
#
# El TIPO importa y se eligió mirando el fotograma del medio de cada candidata:
#
# - `fade` para los cambios de piel. Entre dos tomas idénticas salvo el color,
#   el fundido cruzado no deja fantasma —no hay bordes que no coincidan— y el
#   cambio se lee como la misma pieza cambiando de piel.
#
# - `smoothdown` para la apertura, y NO `fade`. Cerrado y abierto son dos
#   siluetas distintas: al cruzarlas se ven las dos a la vez y el resultado es
#   una doble exposición, no una apertura. El barrido suave de arriba abajo hace
#   que el forro vinotinto aparezca primero por la parte de la solapa y el
#   cuerpo cerrado ceda después: se lee como la solapa levantándose. Es la
#   moción que la fotografía fija no tiene y hay que fabricar.
#   Con metraje real de la apertura (o vídeo generado desde estas tomas) esta
#   transición se sustituye por los fotogramas de verdad y se le quita el
#   `smoothdown`.
PLANOS=(
  "negro-cerrado          2.4 0   fade"
  "verde-botella-cerrado  1.6 0.9 fade"
  "marfil-cerrado         1.6 0.9 fade"
  "vinotinto-cerrado      2.0 0.9 fade"
  "vinotinto-abierto      2.4 1.4 smoothdown"
  "marfil-abierto         1.6 1.0 fade"
  "verde-botella-abierto  1.6 0.9 fade"
  "negro-abierto          2.4 0.9 fade"
)

# --- Platos: recorte 16:9 de cada toma --------------------------------------
# Recorte centrado, sin barras ni fondo inventado: el encuadre original es 3:2 y
# la pieza vive en la banda central, así que se pierden un 8% arriba y abajo de
# telón de fondo y nada de la pieza.
echo "Platos:"
i=0
for plano in "${PLANOS[@]}"; do
  read -r NOMBRE _ _ <<<"$plano"
  ARCHIVO="$ORIGEN/$NOMBRE.jpg"
  [ -f "$ARCHIVO" ] || { echo "No existe: $ARCHIVO" >&2; exit 1; }
  i=$((i + 1))
  ffmpeg -loglevel error -y -i "$ARCHIVO" \
    -vf "scale=${PLATO_W}:-2:flags=lanczos,crop=${PLATO_W}:${PLATO_H}" \
    -q:v 2 "$TEMP/plato-$(printf '%02d' "$i").jpg"
  printf '  %-24s ✓\n' "$NOMBRE"
done

# --- Cadena de fundidos + empuje de cámara ----------------------------------
# `xfade` encadena de dos en dos, y cada eslabón necesita saber en qué segundo
# empieza su fundido. La cuenta es acumulativa: el desplazamiento del eslabón k
# es el del anterior más lo que duró la toma anterior menos su propio fundido.
ENTRADAS=()
CADENA=""
for ((i = 0; i < ${#PLANOS[@]}; i++)); do
  read -r _ DURACION _ _ <<<"${PLANOS[i]}"
  PLATO=$(printf '%s/plato-%02d.jpg' "$TEMP" "$((i + 1))")
  ENTRADAS+=(-loop 1 -t "$DURACION" -i "$PLATO")
  # `settb` antes de xfade: sin base de tiempo común el filtro descarta
  # fotogramas y el fundido sale a tirones.
  CADENA+="[${i}:v]settb=AVTB,fps=${FPS},format=yuv420p[v${i}];"
done

# `FIN` es el segundo en que termina lo encadenado hasta ahora. Cada fundido
# empieza su propia duración ANTES de ese final —así solapa con la toma
# anterior— y el nuevo final es ese arranque más la toma que entra.
read -r _ FIN _ _ <<<"${PLANOS[0]}"
PREV="[v0]"
for ((k = 1; k < ${#PLANOS[@]}; k++)); do
  read -r _ DUR_K FUNDIDO_K TIPO_K <<<"${PLANOS[k]}"
  OFFSET=$(awk -v f="$FIN" -v d="$FUNDIDO_K" 'BEGIN{printf "%.3f", f - d}')
  CADENA+="${PREV}[v${k}]xfade=transition=${TIPO_K}:duration=${FUNDIDO_K}:offset=${OFFSET}[x${k}];"
  PREV="[x${k}]"
  FIN=$(awk -v o="$OFFSET" -v t="$DUR_K" 'BEGIN{printf "%.3f", o + t}')
done

DURACION_TOTAL=$FIN
TOTAL_FOTOGRAMAS=$(awk -v d="$DURACION_TOTAL" -v f="$FPS" 'BEGIN{printf "%d", d * f}')

# Empuje de cámara lentísimo sobre el conjunto, no sobre cada toma: así el
# movimiento no se reinicia en cada fundido y el recorrido entero se lee como un
# solo plano que se acerca mientras la piel cambia.
CADENA+="${PREV}zoompan=z='1+${ZOOM}*on/${TOTAL_FOTOGRAMAS}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${SALIDA_W}x${SALIDA_H}:fps=${FPS}[salida]"

mkdir -p "$DESTINO"
rm -f "$DESTINO"/scrub-*.jpg

ffmpeg -loglevel error -y "${ENTRADAS[@]}" \
  -filter_complex "$CADENA" -map "[salida]" \
  -q:v 5 "$DESTINO/scrub-%04d.jpg"

cp "$DESTINO/scrub-0001.jpg" "$DESTINO/poster.jpg"

TOTAL=$(find "$DESTINO" -name 'scrub-*.jpg' | wc -l | tr -d ' ')
echo
printf 'Recorrido: %s fotogramas · %s · %ss\n' \
  "$TOTAL" "$(du -sh "$DESTINO" | cut -f1)" "$DURACION_TOTAL"
echo "Ponlo en src/data/escenas.js → ESCENAS['bolso-de-mano'].secuencia.total"
