#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
S3_BUCKET="${S3_BUCKET-techcourse-project-2026}"
S3_PREFIX="${S3_PREFIX-salmonbus/lumen}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID-E1SSFHW3MNNQB8}"
export AWS_REGION="${AWS_REGION-ap-northeast-2}"
export PUBLIC_PATH="${PUBLIC_PATH-/lumen/}"
: "${S3_BUCKET:?S3_BUCKET must not be empty}"
: "${S3_PREFIX:?S3_PREFIX must not be empty}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?CLOUDFRONT_DISTRIBUTION_ID must not be empty}"
node -e 'if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(process.env.PUBLIC_PATH)) process.exit(1)'
S3_PREFIX="${S3_PREFIX#/}"
S3_PREFIX="${S3_PREFIX%/}"
case "/$S3_PREFIX/" in
  *'//'*|*'/./'*|*'/../'*) echo 'S3_PREFIX must name a nonempty folder without dot segments.' >&2; exit 1 ;;
esac
destination="s3://$S3_BUCKET/$S3_PREFIX"
command -v aws >/dev/null || { echo 'Install AWS CLI v2 and sign in first.' >&2; exit 1; }
aws sts get-caller-identity >/dev/null
npm run typecheck
npm run check:performance
# Upload immutable assets first, then HTML. Keep old hashes for already-open pages.
aws s3 cp dist/static/ "$destination/static/" --recursive \
  --cache-control 'public,max-age=31536000,immutable' --no-progress
aws s3 cp dist/public/ "$destination/public/" --recursive \
  --cache-control 'public,max-age=86400' --no-progress
aws s3 cp dist/index.html "$destination/index.html" \
  --content-type 'text/html; charset=utf-8' \
  --cache-control 'public,max-age=0,s-maxage=60,must-revalidate' --no-progress
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "${PUBLIC_PATH}index.html" "${PUBLIC_PATH%/}" "$PUBLIC_PATH" \
    "${PUBLIC_PATH}search" "${PUBLIC_PATH}search/"
