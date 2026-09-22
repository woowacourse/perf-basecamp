# 같은 것은 매번 새로 요청하지 않기

## 문제 상황

웹 애플리케이션에서 동일한 리소스를 방문할 때마다 다시 다운로드하면 네트워크 비용과 로딩 시간이 반복해서 발생한다.

기존 애플리케이션에는 다음과 같은 문제가 있었다.

- JavaScript와 이미지의 파일명이 고정되어 있어 장기 캐시를 적용하기 어려웠다.
- 정적 리소스의 브라우저 캐시 기간이 명시되지 않았다.
- Search 페이지에 들어갈 때마다 GIPHY trending API를 다시 호출했다.
- 동일한 trending 요청이 동시에 발생했을 때 요청을 합치는 처리가 없었다.

이번 미션에서는 정적 리소스와 API 데이터에 서로 다른 캐시 전략을 적용했다.

---

## 개선 목표

- 정적 리소스를 CloudFront CDN에서 제공한다.
- 한 번 요청한 정적 리소스는 브라우저와 CloudFront 캐시에서 재사용한다.
- 파일 내용이 변경됐을 때는 새로운 리소스를 요청한다.
- Search 페이지 재진입 시 GIPHY trending API를 매번 요청하지 않는다.
- 동시에 같은 trending 요청이 발생해도 실제 네트워크 요청은 한 번만 수행한다.

---

## 1. 정적 리소스 캐시

### 기존 파일명의 문제

기존 빌드 결과는 항상 같은 파일명을 사용했다.

```text
bundle.js
static/hero.webp
static/trending.webp
```

고정된 URL에 긴 캐시 기간을 적용하면 배포 후 파일 내용이 변경돼도 사용자가 이전 파일을 계속 사용할 수 있다.

이를 피하기 위해 캐시 시간을 짧게 설정하면 변경되지 않은 파일도 반복해서 검증하거나 다운로드해야 한다.

### Content Hash 적용

파일 내용에 따라 이름이 달라지도록 webpack의 `contenthash`를 적용했다.

```js
output: {
  filename: 'scripts/[name].[contenthash:8].js',
  chunkFilename: 'scripts/[name].[contenthash:8].js'
}
```

이미지에도 같은 전략을 적용했다.

```js
{
  test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif|webp)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'assets/[name].[contenthash:8][ext]'
  }
}
```

프로덕션 빌드 결과는 다음과 같이 생성된다.

```text
scripts/main.fe0a204e.js
scripts/search.9ecd8979.js
scripts/729.ec59a1a3.js

assets/hero.423d0cd1.webp
assets/trending.c7fb8970.webp
assets/find.ecf65354.webp
assets/free.190314ee.webp
```

파일의 내용이 같으면 같은 URL을 유지하고, 내용이 변경되면 새로운 hash와 URL이 생성된다. 따라서 이전 리소스와 충돌하지 않으면서 긴 캐시 기간을 설정할 수 있다.

### S3 Cache-Control 전략

hash가 포함된 JavaScript와 이미지는 1년 동안 캐시하도록 설정한다.

```text
scripts/*
assets/*

Cache-Control: public, max-age=31536000, immutable
```

- `public`: 브라우저와 CDN 같은 공유 캐시에서 저장할 수 있다.
- `max-age=31536000`: 브라우저에서 1년 동안 fresh 상태로 취급한다.
- `immutable`: 캐시 기간에는 리소스가 변경되지 않는 URL임을 알린다.

`index.html`은 새로운 hash 파일의 경로를 알려주는 진입점이다. 새 배포를 빠르게 발견할 수 있도록 장기 캐시하지 않는다.

```text
index.html

Cache-Control: no-cache
```

`no-cache`는 저장 자체를 금지하는 의미가 아니라, 재사용하기 전에 서버에 최신 상태를 확인하라는 의미다.

### CloudFront 설정

CloudFront Behavior에는 다음 설정을 사용한다.

- Cache policy: `CachingOptimized`
- Compress objects automatically: 활성화
- Viewer protocol policy: Redirect HTTP to HTTPS

더 세밀하게 관리하려면 path pattern을 구분할 수 있다.

| Path pattern  | 캐시 전략                |
| ------------- | ------------------------ |
| `/scripts/*`  | 장기 캐시                |
| `/assets/*`   | 장기 캐시                |
| `/index.html` | origin의 `no-cache` 존중 |
| Default `*`   | 기본 동작                |

CloudFront의 TTL과 S3가 전달하는 `Cache-Control` 헤더가 함께 최종 캐시 시간을 결정한다.

### 배포 시 주의 사항

정적 파일과 HTML은 서로 다른 `Cache-Control`로 업로드해야 한다.

```bash
aws s3 sync dist "s3://$S3_BUCKET" \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" \
  --cache-control "no-cache" \
  --content-type "text/html"
```

기존 hash 파일은 즉시 삭제하지 않는 편이 안전하다. 배포 직전에 이전 `index.html`을 받은 사용자가 이전 lazy chunk를 요청할 수 있기 때문이다. 오래된 파일은 S3 Lifecycle 정책으로 일정 기간 후 삭제할 수 있다.

### CDN 캐시 검증

동일한 CloudFront 리소스를 두 번 요청해 `X-Cache` 헤더를 확인한다.

```bash
curl -I https://<distribution>.cloudfront.net/scripts/main.<hash>.js
```

첫 요청은 일반적으로 다음과 같다.

```text
X-Cache: Miss from cloudfront
```

같은 엣지에서 다시 요청하면 다음과 같이 변경된다.

```text
X-Cache: Hit from cloudfront
Age: <캐시된 시간>
```

현재 기존 배포의 HTML을 반복 요청했을 때 두 번째 응답에서 `Hit from cloudfront`와 `Age` 헤더를 확인했다. 새 hash 리소스는 새 `dist` 배포 후 동일한 방식으로 다시 검증해야 한다.

---

## 2. GIPHY Trending API 메모이제이션

### 요구사항과 가정

검색을 애플리케이션의 주요 기능으로 취급하고, trending 목록은 실시간으로 계속 갱신할 필요가 없다고 가정했다.

하지만 trending 데이터를 애플리케이션 실행 내내 영구 보관하면 너무 오래된 결과를 보여줄 수 있다. 따라서 5분의 TTL을 적용했다.

```ts
const TRENDING_CACHE_TTL = 5 * 60 * 1000;

let trendingCache: {
  gifs: GifImageModel[];
  cachedAt: number;
} | null = null;
```

### 캐시된 결과 재사용

캐시가 존재하고 5분이 지나지 않았다면 API를 요청하지 않고 이전 결과를 반환한다.

```ts
const isCacheValid =
  trendingCache !== null && Date.now() - trendingCache.cachedAt < TRENDING_CACHE_TTL;

if (isCacheValid && trendingCache !== null) {
  return trendingCache.gifs;
}
```

캐시는 React 컴포넌트가 아니라 API 서비스 모듈에 저장했다. 따라서 Search 컴포넌트가 unmount된 후 다시 mount돼도 모듈이 유지되는 동안 데이터를 재사용할 수 있다.

### 진행 중인 요청 재사용

데이터 캐시만 사용하면 첫 번째 응답이 도착하기 전에 두 번째 호출이 발생했을 때 중복 요청이 생길 수 있다.

이를 방지하기 위해 진행 중인 Promise도 저장한다.

```ts
let trendingRequest: Promise<GifImageModel[]> | null = null;

if (trendingRequest !== null) {
  return trendingRequest;
}

trendingRequest = fetchTrending();
```

요청이 성공하면 결과와 저장 시각을 기록한다.

```ts
try {
  const gifs = await trendingRequest;
  trendingCache = { gifs, cachedAt: Date.now() };
  return gifs;
} finally {
  trendingRequest = null;
}
```

`finally`에서 진행 중인 Promise를 제거하므로 요청이 실패해도 다음 진입에서 다시 시도할 수 있다.

### 동작 흐름

```text
Search 첫 진입
  └─ GIPHY trending 요청
     └─ 응답을 메모리에 저장

5분 안에 Home → Search 재진입
  └─ 저장된 결과 반환
     └─ 네트워크 요청 없음

5분 이후 Search 진입
  └─ GIPHY trending 재요청
     └─ 캐시 갱신
```

---

## 장점

- 재방문 시 정적 리소스 다운로드 비용이 감소한다.
- CloudFront edge에서 응답해 S3 origin 요청과 지연 시간이 감소한다.
- content hash 덕분에 장기 캐시와 안전한 신규 배포를 함께 사용할 수 있다.
- Search 재진입 시 불필요한 GIPHY API 호출을 줄인다.
- 진행 중인 Promise를 공유해 동시 중복 요청도 방지한다.
- 캐시에 TTL을 두어 데이터가 무기한 오래되는 것을 막는다.

## 단점과 고려 사항

- 첫 CDN 요청은 cache miss이므로 S3 origin까지 요청한다.
- CloudFront edge별로 최초 요청은 각각 miss가 발생할 수 있다.
- 5분 동안은 GIPHY의 최신 trending 결과가 바로 반영되지 않는다.
- 메모리 캐시는 새로고침이나 탭 종료 시 사라진다.
- `index.html`까지 장기 캐시하면 새 배포를 발견하지 못할 수 있다.
- S3 업로드 시 객체별 `Cache-Control` 메타데이터를 정확하게 설정해야 한다.
- 사용하지 않는 이전 hash 파일을 정리하는 Lifecycle 정책이 필요할 수 있다.

---

## 검증 방법

### Chrome DevTools에서 정적 리소스 확인

1. 첫 방문 전에 Network 패널을 연다.
2. `Disable cache`를 해제한다.
3. 페이지를 새로고침하고 리소스 응답 헤더를 확인한다.
4. 동일한 페이지에 다시 접근한다.
5. Size 열에서 `(memory cache)` 또는 `(disk cache)`를 확인한다.
6. CloudFront 응답에서는 `X-Cache`와 `Age` 헤더를 확인한다.

### Trending API 확인

1. Network 패널에서 `trending`으로 필터링한다.
2. Search 페이지에 처음 진입해 요청이 한 번 발생하는지 확인한다.
3. Home으로 이동한다.
4. 5분 안에 Search 페이지에 다시 진입한다.
5. 새로운 trending 요청이 발생하지 않는지 확인한다.

---

## 체크리스트

### 코드 구현

- [x] JavaScript 파일명에 content hash 적용
- [x] 이미지 파일명에 content hash 적용
- [x] `index.html`에서 hash가 포함된 최신 파일 참조
- [x] trending 응답 메모이제이션
- [x] trending 캐시에 5분 TTL 적용
- [x] 진행 중인 trending Promise 재사용
- [x] 요청 실패 후 재시도 가능
- [x] TypeScript 검사 통과
- [x] 프로덕션 빌드 성공

### 배포 환경

- [x] CloudFront CDN 연결
- [x] 기존 배포에서 `Hit from cloudfront` 확인
- [ ] 새 `dist`를 S3에 배포
- [ ] S3 객체별 `Cache-Control` 적용
- [ ] 새 hash 리소스의 `Hit from cloudfront` 확인
- [ ] 브라우저 memory/disk cache 확인

---

## 참고 자료

- [AWS CloudFront 캐시 정책 이해하기](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-key-understand-cache-policy.html)
- [AWS CloudFront CachingOptimized 정책](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html)
- [CloudFront 캐시 만료 관리](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
- [AWS CLI S3 cp의 Cache-Control 옵션](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html)
