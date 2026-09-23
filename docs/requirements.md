## 성능 오답노트 : memegle 프로젝트 성능 개선하기

- 미션 저장소 [링크](https://github.com/woowacourse/perf-basecamp)

## 📕 미션 소개

프론트엔드 성능 베이스캠프에 오신 여러분 환영합니다! 🤗

이번 미션에서는 예제로 구성한 짤 검색 사이트, '**Memegle**' 프로젝트의 성능을 개선해볼거에요.

![memegle-home.png](https://techcourse-storage.s3.ap-northeast-2.amazonaws.com/5789f2cca5e14d8299885eabc80d6b36)
![memegle-search.png](https://techcourse-storage.s3.ap-northeast-2.amazonaws.com/f024254513654226ba523a457e6f0a3c)

Memegle 프로젝트는 곳곳에 성능을 저하시키는 요소들로 가득한데요.

여기저기 구멍난 곳들을 고쳐서, 기본적인 수준으로 쓰는 데에 불편함이 없는 버전 1.0.0을 만들어주세요.

---

## ✍️ 진행 방식

- 이번 미션은 개인 미션입니다.
- 예제 프로젝트를 fork 받아 각자 개선 작업을 진행하신 뒤, PR을 보내주세요.
- PR 제출시, PR 템플릿에 있는 항목들을 확인하고 채워주세요.
- 리뷰이가 제출한 PR을 리뷰해주세요.

---

## 🎯 요구사항

### 개선 목표

아래 작업 목록을 다 완료했을 경우 달성할 수 있을 것으로 예상되는 로딩 성능 관련 수치입니다.

측정 환경에 따라 조금씩 다를 수도 있으니, 참고 기준으로만 삼아주세요

이 수치를 완벽히 맞추기 위한 미션이 아니라, 개선 방법들을 한번씩 직접 경험해보기 위한 미션이랍니다. 🙂

- Lighthouse performance `95점` 이상
- Home 페이지에서 불러오는 스크립트 리소스 크기 `< 60kb`
- 히어로 이미지 크기 `< 120kb`
- `프랑스 파리`에서 `Fast 3G` 환경으로 접속했을 때
  - Home 첫 번째 로드시 LCP `< 2.5s`
  - Home 두 번째 이후 로드시 LCP `< 1.5s`
- 화면 버벅임 최소화
  - Dropped Frame 없음
  - Partially Presented Frame 최소화

---

### 작업 목록

#### 1 요청 크기 줄이기

- [ ] 소스코드 크기 줄이기
- [ ] 이미지 크기 줄이기

**도구**

- webpack
- AWS CloudFront

**키워드**

- css/js minify, uglify
- gzip
- image optimization
  - image format
  - image compression

---

#### 2 필요한 것만 요청하기

- [ ] Home 페이지에서 불러오는 스크립트 리소스에 Search 페이지의 소스 코드가 포함되지 않아야 한다.
- [ ] `react-icons` 패키지에서 실제로 사용하는 아이콘 리소스만 빌드 결과에 포함되어야 한다.

**도구**

- webpack
  - [webpack bundle analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- Chrome DevTools > Network

**키워드**

- Code Splitting
- Tree Shaking

#### 3 같은 건 매번 새로 요청하지 않기

- [ ] CDN을 적용하고, 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
  - S3, CloudFront 캐시 설정을 적용한다
- [ ] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.
  - '검색'을 더 주요 기능으로 취급하여, trending 정보가 '실시간으로' 업데이트될 필요는 없다고 가정한다.

**도구**

- AWS CloudFront
- Chrome DevTools > Network
- [WebPageTest](https://www.webpagetest.org/)

**키워드**

- CDN
- HTTP Cache
- Cache Policy
- memoization

---

#### 4 최소한의 변경만 일으키기

- [ ] 검색 결과 > 추가 로드시 추가되는 결과에 대해서만 화면 업데이트가 새로 일어나야 한다.
  - React DevTools의 Profiler 기준으로 기존에 있던 아이템이 다시 렌더되지 않는지 확인
- [ ] Layout Shift 없이 애니메이션이 일어나야 한다.
  - (대상) CustomCursor, 검색 결과 > hover, 도움말 패널 열고닫기 애니메이션
- [ ] Frame Drop이 일어나지 않아야 한다. (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.
  - (대상) 메인 페이지의 CustomCursor, 스크롤 애니메이션

**도구**

- Chrome DevTools > Performance
- React DevTools > Profiler
- [CSS triggers](https://csstriggers.com/)

**키워드**

- Browser Rendering Pipeline

```
아래 경로의 파일들만 수정하셔도 요구사항은 모두 만족할 수 있습니다.
애니메이션이나 검색 등을 위해 여러 로직이 들어가있는데, 해당 코드 자체를 상세하게 이해하실 필요는 없어요!
- App.tsx

- webpack.config.js

- apis/

- Home/

- Search/components/

```

---

## 🚚 선택 요구 사항

- [ ] 도움말 패널 추가 최적화
  - 도움말 패널은 많은 수의 엘리먼트를 포함하고 있습니다. 이 패널 자체를 최적화하는 작업은 위의 요구사항들을 모두 진행한 뒤에 원한다면 추가적으로 시도해보세요 :)
  - `DUMMY_ARTISTS_LENGTH`를 10,000을 넘는 큰 수를 임의로 지정해서 확인해 보세요.
  - 선택적으로 해보는 도전인 만큼, 단순히 라이브러리를 적용해서 해결하기보단 직접 최적화한다면 어떻게 구현할 수 있을 지 고민해 보세요.

**키워드**

- windowing / list virtualization

## ✍️ PR에 포함해야 할 내용

[PR 템플릿](https://github.com/woowacourse/frontend-performance-basecamp/blob/main/.github/pull_request_template.md)을 참고해주세요

## 👀 코드 리뷰 체크 리스트

- 요구사항에 있는 항목에 대해 성능 개선 작업이 잘 이루어졌는지
- 나와 다르게 시도해본 방법들이 있다면 상호 피드백

## 참고 사항

### '프랑스 파리에서 Fast 3G 환경으로 접속했을 때’

→ [WebPageTest](https://www.webpagetest.org/)에서 Paris로 설정하고 테스트해봅니다.

측정 환경에 따라 다를 수 있기 때문에, 수치는 요구 사항에도 언급한 것처럼 참고로만 활용해 주세요

![스크린샷 2025-08-06 오전 2.49.01.png](https://techcourse-storage.s3.ap-northeast-2.amazonaws.com/3a0fd0961c7649c4bf3b087727036af7)

### 'Dropped Frame 없음', 'Partially Presented Frame 최소화'

→ Chrome DevTools > Performance 에서 프로파일링 해본 뒤, Frame 섹션에서 확인할 수 있습니다.

![스크린샷 2025-08-06 오전 2.50.07.png](https://techcourse-storage.s3.ap-northeast-2.amazonaws.com/f9bfa45fa6eb422f95161f019b6836ca)
