#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v cwebp >/dev/null
command -v ffmpeg >/dev/null
output=src/pages/Home/assets
mkdir -p "$output"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
cwebp -quiet -q 72 -resize 1440 0 src/assets/images/hero.png -o "$output/hero.webp"
cwebp -quiet -q 78 -resize 720 0 src/assets/images/hero.png -o "$output/hero-mobile.webp"
for name in trending find free; do
  ffmpeg -hide_banner -loglevel error -y -i "src/assets/images/$name.gif" \
    -an -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p \
    -vf 'scale=trunc(iw/2)*2:trunc(ih/2)*2' -movflags +faststart "$output/$name.mp4"
  ffmpeg -hide_banner -loglevel error -y -i "src/assets/images/$name.gif" \
    -frames:v 1 -update 1 "$work/$name.png"
  cwebp -quiet -q 75 "$work/$name.png" -o "$output/$name.webp"
done
