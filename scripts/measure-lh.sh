#!/usr/bin/env bash
# Lighthouse 3회 측정 후 lh-result/에 저장한다.
#
#   ./scripts/measure-lh.sh <label>
#   예) ./scripts/measure-lh.sh step2   ->  lh-result/lh{1,2,3}-step2.json
#
# 기존 DevTools 측정(before, after-hero)과 조건을 맞추기 위해
# 버전과 스로틀링 방식을 고정한다. 단 CLI는 headless로 동작하므로
# DevTools UI 측정과 완전히 동일하지는 않다.

set -euo pipefail

LABEL="${1:-}"
if [ -z "$LABEL" ]; then
  echo "usage: $0 <label>   (예: $0 step2)" >&2
  exit 1
fi

URL="${LH_URL:-https://inaemin.github.io/perf-basecamp/}"
LH_VERSION="13.4.1"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/perf-result/lighthouse"
mkdir -p "$OUT_DIR"

echo "measuring: $URL"
echo "label    : $LABEL"
echo

for i in 1 2 3; do
  OUT="$OUT_DIR/lh${i}-${LABEL}.json"
  echo "[$i/3] -> perf-result/lighthouse/lh${i}-${LABEL}.json"
  npx -y "lighthouse@${LH_VERSION}" "$URL" \
    --only-categories=performance \
    --form-factor=mobile \
    --screenEmulation.mobile \
    --throttling-method=devtools \
    --output=json \
    --output-path="$OUT" \
    --chrome-flags="--headless=new --disable-extensions --no-first-run" \
    --quiet
done

echo
echo "done. 결과: $OUT_DIR"
