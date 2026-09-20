# 앞으로 할 일

docs/TODO.md의 항목 중 아직 손대지 않은 것과 점검에서 새로 찾은 것을 모았다. 현재 상태는 2026-09-20 프로덕션 빌드(`npm run build:prod`) 결과를 근거로 적었다.

## 1 요청 크기 줄이기

- [ ] **프로덕션 빌드에서 소스맵 빼기**
      `webpack.config.js`의 `devtool: 'source-map'`이 모드 구분 없이 걸려 있어서 `.map` 파일 1.4MB가 함께 배포되고 번들마다 `sourceMappingURL` 주석이 붙는다. `mode === 'production' ? false : 'source-map'`으로 나눈다.

- [ ] **검색 결과 이미지를 원본 gif에서 카드 크기 webp로 바꾸기**
      `src/apis/gifAPIService.ts`의 `convertResponseToModel`이 `images.original.url`을 쓰는데 원본 gif는 장당 수 MB다. 카드는 280x280이라 `images.fixed_width.webp`로 받으면 된다.

- [ ] **hero.webp 재압축**
      1920x1281에 178KB다. 품질을 낮춰 다시 인코딩하거나 `image-minimizer-webpack-plugin`으로 빌드 단계에서 압축한다.

- [ ] **file-loader를 asset modules로 바꾸기**
      webpack 5에서 `file-loader`는 `type: 'asset/resource'`로 대체됐고, 지금은 파일을 그대로 복사만 한다. 이미지 압축 플러그인을 붙이기 전에 정리한다.

## 2 필요한 것만 요청하기

- [ ] **비디오 3개 지연 로드**
      `FeatureItem`의 video가 `autoPlay`로 붙어 있어서 Home 진입 즉시 254KB(find/free/trending)를 전부 받는다. `preload="none"`과 `poster`를 주고 IntersectionObserver로 화면에 들어올 때 재생한다.

- [ ] **검색 결과 이미지 지연 로드**
      `GifItem`의 `img`에 `loading="lazy"`가 없어서 16장이 한 번에 로드된다. 카드 크기가 CSS로 고정돼 있으니 레이아웃 시프트 걱정은 없다.

- [ ] **hero 이미지 우선 로드**
      LCP 요소인데 `index.html`에 `<link rel="preload">`도, `img`에 `fetchpriority="high"`도 없다.

- [ ] **Suspense가 Routes만 감싸게 바꾸기**
      `src/App.tsx`에서 `<Suspense>`가 `<Router>` 바깥에 있어서 라우트 청크를 받는 동안 NavBar와 Footer까지 사라지고 `Loading...`만 남는다.

## 3 같은 건 매번 새로 요청하지 않기

- [ ] **번들 파일명에 contenthash 붙이기**
      `bundle.js`, `526.css`처럼 이름이 고정이라 캐시를 오래 걸면 새 배포가 반영되지 않고 짧게 걸면 매번 다시 받는다. `output.filename`과 `output.chunkFilename`, `MiniCssExtractPlugin`의 `filename`과 `chunkFilename`을 함께 바꾼다.

- [ ] **splitChunks로 vendor 청크 분리**
      react와 react-dom이 main 번들(162KB, gzip 54KB)에 들어 있어서 앱 코드만 바뀌어도 전체를 다시 받는다. contenthash와 같이 적용해야 효과가 난다.

- [ ] **trending API 응답 캐싱**
      `useGifSearch`의 `useEffect`가 Search 페이지 마운트마다 `getTrending()`을 호출한다.

- [ ] **CDN 적용과 Cache-Control 설정**
      코드 밖 작업이라 배포 환경에서 응답 헤더로 확인한다. gzip 여부도 같이 본다.

## 4 최소한의 변경만 일으키기 (마무리)

- [ ] **`transition: all` 남은 4곳 정리**
      `NavBar.module.css:44`와 `Home.module.css:61`은 hover에서 background만 바뀌니 속성을 명시하고, `FeatureItem.module.css:8`은 hover 규칙이 아예 없어서 transition을 지워도 된다. `Search.module.css:107`은 아래 항목과 함께 처리한다.

- [ ] **Search.module.css의 쓰이지 않는 `.loadMoreButton` 삭제**
      더보기 버튼은 `SearchResult.module.css`의 규칙을 쓰고 있어서 `Search.module.css:100~117`은 어디서도 참조되지 않는다.

## 작업 순서

1. webpack 설정을 한 번에 손본다(소스맵, contenthash, splitChunks, asset modules). 빌드 산출물 크기와 캐시 동작으로 확인한다.
2. 요청 크기와 개수를 줄인다(fixed_width.webp, `loading="lazy"`, video `preload`, hero preload). Network 탭으로 재측정한다.
3. trending 캐싱과 Suspense 위치를 바꾼다. React Profiler와 Network 탭으로 확인한다.
4. CSS를 정리한다. Performance 탭에서 hover 구간을 재측정한다.
5. CDN과 캐시 정책을 적용하고 응답 헤더를 확인한다.

각 단계는 지금까지처럼 `fix:` 커밋 뒤에 `docs:` 커밋으로 개선 후 측정 지표를 붙인다.
