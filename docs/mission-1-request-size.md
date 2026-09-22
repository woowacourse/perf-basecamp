# 요청 크기 줄이기

## 문제 상황

초기 성능 측정 결과 전체 리소스 전송량이 약 16MB였으며, 이미지와 JavaScript 번들이 대부분을 차지하고 있었다.

- Lighthouse Performance: 71점
- LCP: 11.7초
- `hero.png`: 약 10.7MB
- GIF 이미지 3개: 약 4.9MB
- `bundle.js`: 원본 약 1.24MB

특히 hero 이미지는 가장 큰 리소스인 동시에 LCP 요소였기 때문에 이미지 최적화를 우선 진행했다.

---

## 1. 소스 코드 크기 줄이기

### 적용 방법

프로덕션 빌드에서 webpack의 기본 JavaScript 압축기인 Terser가 동작하도록 설정했다.

```js
optimization: {
  minimize: isProduction,
  minimizer: [
    '...',
    // 이미지 최적화 플러그인
  ]
}
```

`'...'`은 webpack의 기본 minimizer 설정을 유지한다는 의미다.

프로덕션 빌드에서는 source map도 생성하지 않도록 설정했다.

```js
devtool: isProduction ? false : 'source-map';
```

### 결과

| 항목             |   변경 전 |   변경 후 |
| ---------------- | --------: | --------: |
| `bundle.js`      | 약 1.24MB | 약 205KiB |
| Brotli 전송 크기 |  약 274KB |   약 59KB |

CloudFront의 Brotli 압축과 함께 사용하면 실제 JavaScript 전송 크기를 약 59KB까지 줄일 수 있다.

### 장점

- JavaScript 다운로드 시간 감소
- 코드 파싱 및 컴파일 비용 감소
- 프로덕션 source map 제거로 배포 파일 크기 감소
- webpack 기본 Terser를 사용하므로 별도의 압축기 설정이 적음

### 단점과 한계

- minify된 코드는 사람이 읽기 어려워 운영 환경 디버깅이 어렵다.
- 아직 모든 페이지 코드가 하나의 `bundle.js`에 포함된다.
- Home 페이지에서도 당장 필요하지 않은 Search 페이지 코드를 다운로드한다.

Search 페이지 코드 분리는 다음 미션에서 React `lazy()`와 동적 import를 이용한 Code Splitting으로 개선할 예정이다.

---

## 2. 이미지 크기 줄이기

### 적용 방법

원본 PNG와 GIF를 저장소에 유지하고 프로덕션 빌드 과정에서 webpack이 자동으로 WebP를 생성하도록 구성했다.

사용한 패키지는 다음과 같다.

```bash
npm install --save-dev image-minimizer-webpack-plugin sharp
```

#### Hero 이미지

- PNG를 WebP로 변환
- `4100×2735`에서 `1600×1067`로 리사이즈
- WebP 품질 60 적용
- 압축 effort 6 적용

```js
{
  preset: 'hero-webp',
  implementation: ImageMinimizerPlugin.sharpGenerate,
  options: {
    resize: {
      width: 1600
    },
    encodeOptions: {
      webp: {
        quality: 60,
        effort: 6
      }
    }
  }
}
```

#### 애니메이션 GIF

- GIF를 animated WebP로 변환
- WebP 품질 65 적용
- 원본의 프레임과 반복 설정 유지

```js
{
  preset: 'animated-webp',
  implementation: ImageMinimizerPlugin.sharpGenerate,
  options: {
    encodeOptions: {
      webp: {
        quality: 65,
        effort: 6
      }
    }
  }
}
```

소스에서는 원본 파일과 적용할 preset을 지정한다.

```tsx
import heroImage from '../../assets/images/hero.png?as=hero-webp';
import trendingImage from '../../assets/images/trending.gif?as=animated-webp';
```

`npm run build:prod`를 실행하면 `dist/static`에 최적화된 WebP 파일이 자동으로 생성된다.

### 결과

| 이미지     |   변경 전 |   변경 후 |
| ---------- | --------: | --------: |
| `hero`     | 약 10.7MB |    116KiB |
| `trending` | 약 1.26MB |    634KiB |
| `find`     | 약 1.99MB |    693KiB |
| `free`     | 약 1.69MB |    329KiB |
| 합계       | 약 15.6MB | 약 1.81MB |

전체 이미지 용량이 약 88% 감소했다.

애니메이션 변환 후 프레임과 반복 설정도 확인했다.

| 이미지     | 프레임 | 반복      |
| ---------- | -----: | --------- |
| `trending` |     74 | 무한 반복 |
| `find`     |     14 | 무한 반복 |
| `free`     |     17 | 무한 반복 |

### 이미지 로딩 우선순위 조정

화면 아래의 feature 이미지에는 `IntersectionObserver`와 비동기 디코딩을 적용했다. 요소가 viewport에 25% 이상 들어오기 전에는 이미지 `src`를 DOM에 추가하지 않으므로 초기 요청에서 제외된다.

```tsx
<div>
  {shouldLoadImage && <img src={imageSrc} alt="" decoding="async" />}
</div>
```

Hero 이미지는 LCP 요소이므로 지연 로딩하지 않고 우선순위를 높였다. React가 실행되기 전 HTML 파싱 단계에서 발견할 수 있도록 `index.html`에도 preload를 추가했다.

```tsx
<img src={heroImage} width="1600" height="1067" fetchpriority="high" alt="" />
```

```html
<link
  rel="preload"
  as="image"
  href="<%= require('./src/assets/images/hero.png?as=hero-webp') %>"
  fetchpriority="high"
/>
```

---

## webpack 자동 변환 방식의 장점

- 원본 이미지만 저장소에서 관리하면 된다.
- 개발자가 WebP 파일을 직접 생성할 필요가 없다.
- 이미지 품질과 해상도 정책을 webpack 설정에서 통일할 수 있다.
- CI/CD 환경에서도 동일한 결과물을 생성할 수 있다.
- 최적화하지 않은 이미지가 배포되는 실수를 줄일 수 있다.

## webpack 자동 변환 방식의 단점

### 빌드 시간 증가

Sharp가 프로덕션 빌드마다 원본 이미지를 다시 인코딩한다. 특히 74개 프레임을 가진 GIF의 animated WebP 변환 비용이 크다.

```text
이미지 자동 변환 적용 후 프로덕션 빌드: 약 58초
```

이미지가 변경되지 않았더라도 현재 설정에서는 변환 작업이 다시 실행된다.

### 개발 의존성 증가

다음 패키지와 Sharp가 사용하는 플랫폼별 바이너리가 추가된다.

- `image-minimizer-webpack-plugin`
- `sharp`
- `libvips`

이에 따라 `node_modules`와 `package-lock.json`의 크기가 증가한다.

### 설정 및 검증 비용 증가

- 이미지 종류별 preset 관리가 필요하다.
- query string에 맞는 TypeScript 모듈 선언이 필요하다.
- animated WebP의 프레임 보존 여부를 확인해야 한다.
- 잘못 설정하면 GIF의 첫 번째 프레임만 출력될 수 있다.
- 손실 압축 품질을 실제 화면에서 확인해야 한다.

---

## 빌드 시간 개선 방안

webpack filesystem cache를 적용하면 최초 빌드 결과를 디스크에 저장해 이후 빌드에서 재사용할 수 있다.

```js
cache: {
  type: 'filesystem';
}
```

그 밖의 대안은 다음과 같다.

- Sharp의 `effort` 값을 낮춰 압축 시간 단축
- 이미지 변환을 별도의 CI 단계로 분리
- 변환된 WebP를 저장소에 포함
- 변경된 이미지만 변환하는 별도 스크립트 사용

이번 미션에서는 이미지 최적화 과정의 자동화와 일관성을 우선해 webpack 빌드 시 변환하는 방식을 선택했다.

---

## 체크리스트

- [x] 프로덕션 JavaScript minify 적용
- [x] 프로덕션 source map 제거
- [x] CloudFront Brotli 적용 시 스크립트 전송량 60KB 미만
- [x] Hero 이미지 120KB 미만
- [x] PNG를 WebP로 자동 변환
- [x] GIF를 animated WebP로 자동 변환
- [x] 애니메이션 프레임 및 반복 설정 유지
- [x] 화면 아래 이미지 IntersectionObserver 지연 요청 적용
- [x] 원본 이미지만 소스에서 관리
- [x] webpack 프로덕션 빌드 성공
- [ ] webpack filesystem cache 적용
- [x] 페이지 단위 Code Splitting 적용
- [x] 배포 후 Lighthouse 재측정: Performance 100점, LCP 0.6초
