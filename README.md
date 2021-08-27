# 🚀 프론트엔드 성능 베이스캠프
## 성능 오답노트 : memegle 프로젝트 성능 개선하기
<img width=400 src="https://user-images.githubusercontent.com/81607552/129674696-2fe7251b-90fe-4dec-8bc5-5d47bcc9159c.png"> <img width=370 src="https://user-images.githubusercontent.com/81607552/129674723-03d93732-1aba-42ca-a7cf-d2abe1005847.png">

## **🎯 요구사항**

### 개선 목표

- Lighthouse `95점` 이상
- Home 페이지에서 불러오는 스크립트 리소스 크기 `< 60kb`
- 히어로 이미지 크기 `< 120kb`
- `프랑스 파리`에서 `Fast 3G` 환경으로 접속했을 때
    - Home 첫 번째 로드시 LCP `< 2.5s`
    - Home 두 번째 이후 로드시 LCP `< 1.5s`

### 작업 목록

#### 1 요청 크기 줄이기
- [ ]  소스코드 크기 줄이기
- [ ]  이미지 크기 줄이기

도구
- webpack
- CloudFront

키워드
- css/js minify, uglify
- gzip
- image optimization - image format, compression
    
    
#### 2 필요한 것만 요청하기
- [ ]  Home 페이지에서 불러오는 스크립트 리소스에 gif 검색을 위한 giphy 모듈이 포함되어 있지 않아야 한다.

도구
- webpack
- Chrome DevTools > Network

키워드
- Code Splitting
    
    
#### 3 같은 건 매번 새로 요청하지 않기
- [ ]  CDN을 적용하고, 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
- [ ]  GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.

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
- [ ]  검색 결과 > 추가 로드시 추가된 목록만 렌더되어야 한다.
- [ ]  LayoutShift 없이 hover 애니메이션이 일어나야 한다.

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
