# TODO

## 성능 개선 전 체크 사항

- [x] Lighthouse
- [x] Home 페이지에서 불러오는 스크립트 리소스 크기
- [x] 히어로 이미지 크기
- [x] 프랑스 파이 Fast 3G환경 접속 시 LCP 속도
  - [x] Home 첫번째 로드 시 LCP 속도
  - [x] Home 두번째 로드 시 LCP 속도
- [x] Chrome CPU 6x slowdown Network Fast 3G 환경에서 화면 버벅임

  - Dropped Frame
  - Partially Presented Frame

  ## 성능 개선 후 체크 사항

- [] Lighthouse 95점 이상
- [] Home 페이지에서 불러오는 스크립트 리소스 크기 < 60kb
- [] 히어로 이미지 크기 < 120kb
- [] 프랑스 파리에서 Fast 3G 환경으로 접속했을 때 Home 두 번째 이후 로드시 LCP < 1.2s
- [] WebPageTest에서 Paris - EC2 Chrome CPU 6x slowdown Network Fast 3G 환경 기준으로 확인
- [] Chrome CPU 6x slowdown Network Fast 3G 환경에서 화면 버벅임 최소화
  - [] Dropped Frame 없음.
  - [] Partially Presented Frame 최소화.

## 성능 개선을 위한 목록

### 1 요청 크기 줄이기

- [x] 소스코드 크기 줄이기
  - js: webpack의 내장 기능을 사용해 압축
  - css
    - css 파일을 분리 :MiniCssExtractPlugin
    - css 파일 압축 :CssMinimizerPlugin
- [x] 이미지 크기 줄이기
  - 이미지 포맷 변경: webp
    // TODO
  - 화면 크기에 따라 이미지 크기 변경 :

도구

- [x] webpack
- [x] CloudFront

키워드

- [x] css/js minify, uglify
- [x] gzip (CloudFront의 gzip 사용)
- [x] image optimization - image format, compression

### 2 필요한 것만 요청하기

- [x] Home 페이지에서 불러오는 스크립트 리소스에 Search 페이지의 소스 코드가 포함되지 않아야 한다. -> 동적 import
- [x] react-icons 패키지에서 실제로 사용하는 아이콘 리소스만 빌드 결과에 포함되어야 한다. -> three shaking

도구

- webpack
- Chrome DevTools > Network

키워드

- [x]Code Splitting

### 3 같은 건 매번 새로 요청하지 않기

- [x] CDN을 적용하고, 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
  - cloudFront의 cache 설정 사용
- [x] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다. - fetch의 cache 옵션 사용
      도구

- CloudFront
- Chrome DevTools > Network
- [WebPageTest](https://www.webpagetest.org/)

키워드

- CDN
- HTTP Cache
- Cache Policy
- memoization

### 4 최소한의 변경만 일으키기

- [x] 검색 결과 > 추가 로드시 추가된 목록만 새로 렌더되어야 한다.
- [x] Layout Shift 없이 애니메이션이 일어나야 한다.
  - [x] CustomCursor
  - [x] 검색 결과 > hover
  - [x] 도움말 패널 열고닫기 애니메이션
- [ ] Frame Drop이 일어나지 않아야 한다.(Chrome DevTools 기준)
  - [] 메인 페이지의 CustomCursor
  - [] 스크롤 애니메이션
- [] Partially Presented Frame 역시 최소로 발생해야 한다.
  - [] 메인 페이지의 CustomCursor
  - [] 스크롤 애니메이션

도구

- Chrome DevTools > Performance
- React Profiler
- CSS triggers

키워드

- Browser Rendering Pipeline
