### 작업 목록

#### 1 요청 크기 줄이기

- [x] 소스코드 크기 줄이기
- [x] 이미지 크기 줄이기

도구

- webpack
- CloudFront

키워드

- css/js minify, uglify
- gzip
- image optimization
- image format, compression

#### 2 필요한 것만 요청하기

- [x] Home 페이지에서 불러오는 스크립트 리소스에 Search 페이지의 소스 코드가 포함되지 않아야 한다.
- [x] react-icons 패키지에서 실제로 사용하는 아이콘 리소스만 빌드 결과에 포함되어야 한다.

도구

- webpack
- Chrome DevTools > Network

키워드

- Code Splitting

#### 3 같은 건 매번 새로 요청하지 않기

- [x] CDN을 적용하고, 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
- [x] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.

도구

- CloudFront
- Chrome DevTools > Network
- [WebPageTest](https://www.webpagetest.org/)

키워드

- CDN
- HTTP Cache
- Cache Policy
- memoization

#### 4 최소한의 변경만 일으키기

- [x] 검색 결과 > 추가 로드시 추가된 목록만 새로 렌더되어야 한다.
- [x] Layout Shift 없이 애니메이션이 일어나야 한다.
- [x] Frame Drop이 일어나지 않아야 한다.
  - (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.

도구

- Chrome DevTools > Performance
- React Profiler
- CSS triggers

키워드

- Browser Rendering Pipeline
