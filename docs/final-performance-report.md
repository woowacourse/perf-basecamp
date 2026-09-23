# 성능 최적화 배포 및 최종 측정 기록

## 목표

이번 작업의 최종 성능 목표는 다음과 같았다.

- Lighthouse Performance 95점 이상
- Home 페이지에서 불러오는 초기 JavaScript 리소스 60KiB 미만
- Hero 이미지 120KB 미만
- CloudFront CDN과 브라우저 캐시 적용
- LCP 리소스를 초기 HTML에서 빠르게 발견하고 우선 요청
- 화면 아래의 무거운 애니메이션 이미지는 실제로 필요할 때만 요청

> 이 문서에서 빌드 도구와 Lighthouse가 표시하는 `KiB`는 1KiB = 1,024bytes를 기준으로 한다.

---

## 최초 측정

최적화 전에는 이미지와 하나로 합쳐진 JavaScript 번들이 초기 요청 크기의 대부분을 차지했다.

| 항목                   | 최초 측정 |
| ---------------------- | --------: |
| Lighthouse Performance |      71점 |
| LCP                    |    11.7초 |
| 전체 리소스 전송량     |   약 16MB |
| Hero PNG               | 약 10.7MB |
| GIF 이미지 3개 합계    |  약 4.9MB |
| JavaScript 번들 원본   | 약 1.24MB |

Hero 이미지는 가장 큰 리소스이면서 LCP 요소였고, Home에서 사용하지 않는 Search 코드와 화면 아래의 GIF까지 초기 로딩 비용에 포함되어 있었다.

---

## 적용한 최적화

### 1. JavaScript와 이미지 크기 축소

- 프로덕션 빌드에서 webpack 기본 Terser minify 적용
- 프로덕션 source map 제거
- Hero PNG를 `1600×1067`, 품질 60의 WebP로 자동 변환
- GIF 3개를 animated WebP로 자동 변환
- 이미지 변환을 `image-minimizer-webpack-plugin`과 Sharp로 빌드 과정에 자동화
- CloudFront의 Brotli 압축 사용

이미지 합계는 약 15.6MB에서 약 1.81MB로 약 88% 감소했고, Hero 이미지는 약 10.7MB에서 118,440bytes로 줄었다.

### 2. 필요한 코드만 요청

- Search 페이지에 React `lazy()`와 동적 `import()` 적용
- Home 초기 번들에서 Search 페이지 코드 분리
- Search에서 사용하는 `react-icons` 세 개만 Tree Shaking 결과에 포함
- Home에서 사용하던 `classnames` 의존을 제거하고 CSS Module 문자열을 직접 조합

Search 코드와 아이콘 vendor 청크는 Home 진입 시 요청되지 않고 `/search`에 처음 진입할 때 요청된다.

### 3. CDN과 캐시 적용

- JavaScript와 이미지 파일명에 `contenthash` 적용
- `scripts/*`, `assets/*`에 다음 메타데이터 적용

```text
Cache-Control: public,max-age=31536000,immutable
```

- 새 hash 파일을 알려주는 `index.html`에는 다음 메타데이터 적용

```text
Cache-Control: no-cache
Content-Type: text/html
```

- CloudFront의 자동 압축 활성화
- 배포 후 `/*` invalidation으로 이전 HTML과 캐시된 응답 제거
- 최종 JavaScript 응답에서 `Content-Encoding: br`, `X-Cache: Hit from cloudfront` 확인
- GIPHY trending 응답에 5분 메모리 캐시와 진행 중 Promise 재사용 적용

### 4. LCP 요청 우선순위 개선

첫 배포 후 Lighthouse의 `LCP request discovery` 진단에서 다음 두 항목이 실패했다.

```text
fetchpriority=high should be applied
Request is discoverable in initial document
```

Hero URL이 React JavaScript 실행 후에야 발견됐기 때문이다. `fetchpriority`만 이미지 태그에 추가해도 초기 HTML에서 URL을 발견하지 못하는 문제는 해결되지 않는다.

따라서 `index.html`에 Hero preload를 추가했다.

```html
<link
  rel="preload"
  as="image"
  href="<%= require('./src/assets/images/hero.png?as=hero-webp') %>"
  fetchpriority="high"
/>
```

실제 이미지에도 같은 우선순위를 지정했다.

```tsx
<img src={heroImage} width="1600" height="1067" fetchpriority="high" alt="" />
```

적용 후 Lighthouse의 LCP discovery 세부 항목이 모두 통과했다.

- `fetchpriority=high applied`: 통과
- `Request is discoverable in initial document`: 통과
- `LCP resources should not use loading=lazy`: 통과

### 5. 렌더 차단 Google Fonts 제거

중간 측정에서 Google Fonts 스타일시트가 초기 렌더를 약 390ms 차단하는 것으로 표시됐다. 스타일시트를 비동기로 불러오고 JavaScript가 비활성화된 환경을 위해 `noscript` fallback을 추가했다.

```html
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?..."
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?..." />
</noscript>
```

최종 Lighthouse에서는 render-blocking 진단을 통과했다.

### 6. 화면 아래 animated WebP 요청 지연

HTML의 `loading="lazy"`만 사용한 중간 배포에서는 Lighthouse 측정 중 화면 아래의 animated WebP 세 개도 모두 요청됐다. 이 때문에 이미지 최적화와 LCP 개선 후에도 전체 전송량이 약 1.9MiB로 남았다.

`FeatureItem`에 `IntersectionObserver`를 적용해 요소가 viewport에 들어오기 150px 전에 이미지 `src`를 DOM에 추가하도록 변경했다. 초기 viewport와 가까운 이미지는 바로 요청될 수 있으므로 낮은 fetch 우선순위를 지정해 Hero와의 경쟁을 줄였다. viewport에서 먼 나머지 이미지는 요청하지 않으면서 스크롤 시 이미지가 준비될 시간을 확보했다.

```tsx
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setShouldLoadImage(true);
      observer.disconnect();
    }
  },
  { rootMargin: '150px 0px' }
);
```

```tsx
<div>
  {shouldLoadImage && (
    <img src={imageSrc} alt="" decoding="async" fetchpriority="low" />
  )}
</div>
```

브라우저에서 이미지 요청 수가 최초 Hero 1개에서 스크롤 위치에 따라 3개, 4개로 증가하는 것을 확인했다. 이미지 영역 크기는 CSS로 유지되므로 이미지 삽입으로 인한 Layout Shift도 발생하지 않는다.

---

## 측정 과정

### 중간 CloudFront 배포

LCP preload는 적용됐지만 화면 아래 animated WebP를 아직 `loading="lazy"`에만 맡겼던 시점의 결과다.

| 항목                   | 중간 측정 |
| ---------------------- | --------: |
| Lighthouse Performance |      86점 |
| FCP                    |     0.8초 |
| LCP                    |     2.1초 |
| Speed Index            |     1.9초 |
| TBT                    |       0ms |
| CLS                    |     0.003 |
| 전체 전송량            | 약 1.9MiB |

JavaScript 실행 비용이나 Layout Shift보다 초기 측정 중 함께 다운로드된 animated WebP의 네트워크 비용이 주요 차이였다.

WebPageTest 중간 측정에서는 다음 값도 확인했다.

| 항목        | 중간 측정 |
| ----------- | --------: |
| FCP         |   3.255초 |
| LCP         |   3.255초 |
| CLS         |     0.001 |
| TTFB        |   1.322초 |
| TBT         |       0초 |
| Page Weight |       2MB |
| 요청 수     |       9개 |

이 측정은 최종 IntersectionObserver 적용 전 결과이며, 측정 지역과 네트워크 조건에 따라 Lighthouse와 직접 비교할 수는 없다. 목표에 명시된 Paris/Fast 3G 조건은 최종 배포본으로 별도 재측정해야 한다.

### 최종 CloudFront 배포

측정 주소는 CloudFront 배포 도메인이며, 최신 파일 업로드와 invalidation 완료 후 Lighthouse Desktop으로 측정했다.

| 항목                   |    최초 | 중간 배포 |  최종 배포 |
| ---------------------- | ------: | --------: | ---------: |
| Lighthouse Performance |    71점 |      86점 |  **100점** |
| FCP                    |       - |     0.8초 |  **0.3초** |
| LCP                    |  11.7초 |     2.1초 |  **0.6초** |
| Speed Index            |       - |     1.9초 |  **0.5초** |
| TBT                    |       - |       0ms |    **0ms** |
| CLS                    |       - |     0.003 |  **0.003** |
| 전체 전송량            | 약 16MB | 약 1.9MiB | **242KiB** |

최종 초기 리소스 중 주요 파일은 다음과 같다.

| 리소스               |                     전송 크기 | 압축 해제 크기 | 우선순위 |
| -------------------- | ----------------------------: | -------------: | -------- |
| `hero.423d0cd1.webp` |  **118,795bytes (약 116KiB)** |   118,440bytes | High     |
| `main.23a693d5.js`   | **61,282bytes (약 59.85KiB)** |   190,154bytes | Low      |

초기 화면에서 애플리케이션 이미지로는 Hero만, 애플리케이션 JavaScript로는 main 스크립트만 요청됐고 animated WebP는 스크롤 전까지 요청되지 않았다.

> JavaScript는 60KiB인 61,440bytes보다 158bytes 작다. 다만 `60KB`를 십진 단위인 60,000bytes로 엄격하게 해석하면 1,282bytes 초과한다. Lighthouse와 webpack의 KiB 표기를 기준으로는 요구사항을 충족한다.

---

## 배포 중 겪은 문제

### AWS CLI 자격 증명 부재

로컬 AWS CLI에서 다음 오류가 발생했다.

```text
Unable to locate credentials. You can configure credentials by running "aws configure".
```

CLI 자격 증명을 사용할 수 없어 AWS Console에서 `dist` 파일을 S3에 직접 업로드하고 객체 메타데이터를 설정했다. 이 경우에도 파일 종류별 `Cache-Control`과 `Content-Type`을 구분해야 한다.

### 새 파일 업로드와 캐시 무효화 순서

CloudFront invalidation은 S3 파일을 변경하거나 삭제하는 작업이 아니다. Edge에 남아 있는 기존 캐시를 만료시켜 다음 요청이 origin의 최신 파일을 확인하게 만드는 작업이다.

배포 도중 이전 무효화가 끝난 뒤 `index.html`과 새 JavaScript를 다시 업로드했기 때문에 최신 HTML을 반영하려면 invalidation을 한 번 더 수행해야 했다. 최종적으로 `/*` invalidation이 완료된 후 다음 사항을 확인했다.

- HTML이 `main.23a693d5.js`를 참조
- HTML에 Hero preload와 `fetchpriority="high"` 포함
- JavaScript에 `Content-Encoding: br` 적용
- JavaScript에 장기 `Cache-Control` 적용
- `X-Cache: Hit from cloudfront` 확인

즉, 매번 무효화할 필요는 없지만 이미 캐시된 URL의 내용을 덮어썼거나 `index.html`을 즉시 갱신해야 할 때는 필요하다. content hash가 바뀐 JavaScript와 이미지는 새 URL이므로 해당 파일 자체에는 보통 무효화가 필요하지 않다.

---

## 장점

- 초기 전송량이 약 16MB에서 242KiB로 크게 감소했다.
- LCP가 11.7초에서 0.6초로 감소했다.
- Hero를 HTML 파싱 단계에서 발견하고 높은 우선순위로 요청한다.
- Home에서 Search 코드와 아이콘을 요청하지 않는다.
- 화면 아래의 큰 animated WebP를 실제로 볼 때만 요청한다.
- content hash와 장기 캐시를 함께 사용해 재방문 비용을 줄이면서 안전하게 새 버전을 배포할 수 있다.
- 최종 배포 환경에서 CloudFront cache hit와 Brotli 압축을 확인했다.

## 단점과 고려 사항

- webpack에서 animated WebP를 생성하므로 프로덕션 빌드 시간이 약 58초까지 증가한다.
- IntersectionObserver와 이미지 표시 상태를 직접 관리하는 코드가 추가됐다.
- 이미지가 화면에 가까워진 뒤 요청되므로 느린 네트워크에서는 해당 영역에 도달했을 때 잠깐 빈 공간이 보일 수 있다.
- 비동기 Google Fonts는 초기 렌더 차단을 줄이지만 폰트가 교체되는 순간 시각적 변화가 생길 수 있다.
- S3 Console로 수동 배포하면 객체별 메타데이터 누락이나 잘못된 업로드 순서가 발생하기 쉽다.
- Lighthouse 점수는 네트워크, 측정 위치, CloudFront edge 상태에 따라 달라질 수 있다.

---

## 최종 체크리스트

- [x] Lighthouse Performance 95점 이상: 100점
- [x] Home 초기 JavaScript 60KiB 미만: 약 59.85KiB
- [x] Hero 이미지 120KB 미만: 118,795bytes
- [x] Hero를 초기 HTML에서 발견
- [x] Hero에 `fetchpriority="high"` 적용
- [x] Hero lazy loading 미적용
- [x] Google Fonts 렌더 차단 제거
- [x] 화면 아래 animated WebP의 초기 요청 제외
- [x] CloudFront Brotli 압축 확인
- [x] 정적 리소스 장기 캐시 확인
- [x] CloudFront cache hit 확인
- [x] 최종 invalidation 완료 후 최신 배포 확인
- [ ] WebPageTest Paris/Fast 3G 조건에서 최종 LCP 재측정
- [ ] 브라우저 재방문 시 memory/disk cache 캡처
