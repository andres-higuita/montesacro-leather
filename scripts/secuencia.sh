#!/usr/bin/env bash
#
# Convierte el vídeo de la portada en la secuencia de fotogramas que consume
# el hero (src/components/apertura/AperturaScroll.jsx).
#
#   ./scripts/secuencia.sh ~/Descargas/apertura.mp4
#
# Al terminar imprime el número de fotogramas. Ese número va en
# `SECUENCIA_APERTURA.total`, en src/data/imagenes.js.
#
# Usa WebP si `cwebp` está disponible (pesa la mitad); si no, cae a JPEG.
# Instalar WebP:  brew install webp

set -euo pipefail

# --vertical → variante 9:16 para móvil, a su propia carpeta
if [ "${1:-}" = "--vertical" ]; then
  shift
  DESTINO="public/secuencia-vertical"
  VARIANTE="vertical"
else
  DESTINO="public/secuencia"
  VARIANTE="apaisada"
fi

VIDEO="${1:?Uso: ./scripts/secuencia.sh [--vertical] <archivo.mp4>}"

# --- Valores con los que se generó la secuencia actual --------------------
# 15 fps basta: el ritmo lo pone el scroll, no un reproductor. A 24 fps el
# peso sube un 60% y no se nota la diferencia al arrastrar.
FPS="${FPS:-15}"
# Reescalado a 1080 de alto con lanczos. No inventa detalle —el origen es 720p—
# pero evita que el canvas remuestree con filtro barato en pantallas 2x.
if [ "$VARIANTE" = vertical ]; then
  ESCALA="${ESCALA:-scale=1080:1920:flags=lanczos}"
else
  ESCALA="${ESCALA:-scale=1920:1080:flags=lanczos}"
fi
# Corta antes del primerísimo plano final: ahí el texto inventado de la placa
# crece hasta hacerse ilegible y delata que la pieza es generada.
DURACION="${DURACION:-8.2}"
# Borra la marca de agua de la esquina inferior derecha SIN recortar: delogo
# interpola desde los pixeles vecinos, asi que se conserva el encuadre 16:9
# entero. Un recuadro negro se veria en los planos donde el fondo no es negro
# puro. Ajustar las coordenadas si cambia el metraje.
if [ "$VARIANTE" = vertical ]; then
  # La marca de agua de un 9:16 cae en otra esquina. Ajustar si cambia.
  RECORTE="${RECORTE:-delogo=x=592:y=1030:w=110:h=110}"
else
  RECORTE="${RECORTE:-delogo=x=1092:y=548:w=186:h=170}"
fi

[ -f "$VIDEO" ] || { echo "No existe: $VIDEO" >&2; exit 1; }

rm -rf "$DESTINO"
mkdir -p "$DESTINO"

if command -v cwebp >/dev/null 2>&1; then
  echo "→ WebP"
  TEMP="$(mktemp -d)"
  trap 'rm -rf "$TEMP"' EXIT
  ffmpeg -loglevel error -i "$VIDEO" -t "$DURACION" \
    -vf "${RECORTE},fps=${FPS},${ESCALA}" \
    "$TEMP/f-%04d.png"
  i=0
  for f in "$TEMP"/f-*.png; do
    i=$((i + 1))
    cwebp -quiet -q 82 "$f" -o "$(printf '%s/apertura-%04d.webp' "$DESTINO" "$i")"
  done
  EXT=webp
else
  echo "→ JPEG (instala 'brew install webp' para bajar el peso a la mitad)"
  ffmpeg -loglevel error -i "$VIDEO" -t "$DURACION" \
    -vf "${RECORTE},fps=${FPS},${ESCALA}" \
    -q:v 3 \
    "$DESTINO/apertura-%04d.jpg"
  EXT=jpg
fi

TOTAL=$(find "$DESTINO" -name "apertura-*.$EXT" | wc -l | tr -d ' ')
PESO=$(du -sh "$DESTINO" | cut -f1)

echo
echo "  Fotogramas : $TOTAL"
echo "  Formato    : .$EXT"
echo "  Peso total : $PESO"
echo
if [ "$VARIANTE" = vertical ]; then
  echo "En src/data/imagenes.js, dentro de SECUENCIA_VERTICAL:"
else
  echo "En src/data/imagenes.js, dentro de SECUENCIA_APERTURA:"
fi
echo "  total: $TOTAL,"
[ "$EXT" = jpg ] && echo "  ruta: (i) => \`/secuencia/apertura-\${String(i + 1).padStart(4, '0')}.jpg\`,"
