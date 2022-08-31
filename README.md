# 🚀 프론트엔드 성능 베이스캠프

## 성능 오답노트 : memegle 프로젝트 성능 개선하기

## 📕 미션 소개

프론트엔드 성능 베이스캠프에 오신 여러분 환영합니다! 🤗

이번 미션에서는 예제로 구성한 짤 검색 사이트, 'Memegle' 프로젝트의 성능을 개선해볼거에요.

<img width=400 src="https://user-images.githubusercontent.com/81607552/129674696-2fe7251b-90fe-4dec-8bc5-5d47bcc9159c.png"> <img width=370 src="https://user-images.githubusercontent.com/81607552/129674723-03d93732-1aba-42ca-a7cf-d2abe1005847.png">

Memegle 프로젝트는 곳곳에 성능을 저하시키는 요소들로 가득한데요.  
여기저기 구멍난 곳들을 고쳐서, 기본적인 수준으로 쓰는 데에 불편함이 없는 버전 1.0.0을 만들어주세요.

(엉망진창 성능의) 배포된 샘플 프로젝트는 [여기](http://frontend-perf-basecamp-experiment.s3-website.ap-northeast-2.amazonaws.com/)에서 확인할 수 있습니다.

## ✅ 미션을 시작하기 전에...

몇 가지 계정 생성이 필요합니다.

- gif 검색을 위해 GIPHY API 를 사용하고 있습니다.  
  GIPHY API 키 발급을 위해 [GIPHY](https://developers.giphy.com/)에서 가입 후 앱 생성 > API 키 발급이 필요합니다.

  - 발급한 키는 루트 경로에 `.env`파일을 만들어 GIPHY_API_KEY 값으로 설정해주세요

  ```xml
  // .env
  GIPHY_API_KEY={발급받은 API KEY}
  ```

- 우테코 AWS 개인 계정에서 진행합니다.

## 📅 **진행 방식**

- 이번 미션은 개인 미션입니다. 
- 예제 프로젝트를 fork 받아 각자 개선 작업을 진행하신 뒤, PR을 보내주세요.
- PR 제출시, PR 템플릿에 있는 항목들을 확인하고 내용을 작성해주세요.
- 리뷰이가 제출한 PR을 체크리스트를 기준으로 확인해주세요.

## **🎯 요구사항**

### 개선 목표

아래 작업 목록을 다 완료했을 경우 달성할 수 있을 것으로 예상되는 로딩 성능 관련 수치입니다.  
측정 환경에 따라 조금씩 다를 수도 있으니, 참고 기준으로만 삼아주세요  
이 수치를 완벽히 맞추기 위한 미션이 아니라, 개선 방법들을 한번씩 직접 경험해보기 위한 미션이랍니다. 🙂

- Lighthouse `95점` 이상
- Home 페이지에서 불러오는 스크립트 리소스 크기 `< 60kb`
- 히어로 이미지 크기 `< 120kb`
- `프랑스 파리`에서 `Fast 3G` 환경으로 접속했을 때 Home 두 번째 이후 로드시 LCP < 1.2s
  - WebPageTest에서 Paris - EC2 Chrome CPU 6x slowdown Network Fast 3G 환경 기준으로 확인
- Chrome CPU 6x slowdown Network Fast 3G 환경에서 화면 버벅임 최소화
  - Dropped Frame 없음. Partially Presented Frame 최소화.

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
- image optimization - image format, compression

#### 2 필요한 것만 요청하기

- [x] Home 페이지에서 불러오는 스크립트 리소스에 gif 검색을 위한 giphy 모듈이 포함되어 있지 않아야 한다.
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

## ✍️ PR에 포함해야 할 내용

[PR 템플릿](https://github.com/woowacourse/frontend-performance-basecamp/blob/main/.github/pull_request_template.md)을 참고해주세요

## 👀 코드 리뷰 체크 리스트

- 요구사항에 있는 항목에 대해 성능 개선 작업이 잘 이루어졌는지
- 나와 다르게 시도해본 방법들이 있다면 상호 피드백
