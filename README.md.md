# 성능 오답노트 : memegle 프로젝트 성능 개선하기

## 접근 프로세스

**측정 → 분석 → 개선**

## 작업 현황

### 측정

- 성능 점수 (lightHouse)
- 크기
  - bundle.js 소스코드 크기
  - 히어로 이미지 크기
- 속도 (프랑스 파리 기준)
  - 1번째 lcp 로드
  - 2번째 lcp 로드
- 프레임
  - Dropped Frame
  - Partially Presented Frame

### 분석

- [x] 성능 점수 (lightHouse)
  - [x] 현재 점수 : 67점
    - [x] 콘텐츠가 포함된 최대 페인트 요소(LCP) : 11.2초
    - [x] 차세대 이미지 형식 제공 필요 : 절감 가능치 8,597 kb
    - [x] 이미지 크기 최적화 필요 : 절감 가능치 7,787 kb
    - [x] 렌더링 차단 리소스 존재 : 절감 가능치 300ms
    - [x] 사용하지 않는 자바스크립트 : 절감 가능치 376 kb
    - [x] 자바스크립트 추가 절감 가능 : 25 kb
    - [x] 애니메이션/동영상 형식 사용 개선 : 절감 가능치 3,896 kb
    - [x] 레거시 JavaScript 제공 중 : 절감 가능치 41 kb
    - [x] 네트워크 페이로드 관리 필요 : 총 크기 15,563 kb
- [x] 크기
  - [x] bundle.js 소스코드 크기 : 247kb (gzip 전 948kb)
  - [x] 히어로 이미지 크기 : 10,918kb
- [x] 속도 (프랑스 파리 기준)
  - [x] 1번째 lcp 로드 : 2.548s (fast) / 8.764s (slow)
  - [x] 2번째 lcp 로드 : 1.762s (fast) / 2.175s (slow)
- [x] 프레임
  - [x] Dropped Frame : 초반 로드시 존재
  - [x] Partially Presented Frame ?

### 개선

- [ ] 크기
  - [x] bundle.js 소스코드 (결과) : gzip 전 172kb
  - [ ] 히어로 이미지 크기 (결과)
- [ ] 속도(프랑스 파리 기준)
- [ ] 프레임

### 기능요구사항

- [ ] 요청 크기 줄이기
  - [x] 소스코드
    - [x] JS Minify/Uglify 활성화
    - [x] CSS Minify 적용 (효과 없는듯 -> 위에서 같이 해주는 듯)
    - [x] CSS 분리 추출
  - [ ] 이미지
    - [x] 이미지 압축 플러그인 적용 (sharp)
- [x] 필요한 것만 요청하기
  - [x] Home 페이지에서 Search 페이지의 소스 코드가 포함x
    - [x] 페이지별 lazy 로딩 적용
    - [x] suspense로 fallback ui 적용
    - [x] lazy 로딩 동작 테스트 (promise 반환)
  - [x] `react-icons` 패키지에서 실제 사용되는 부분
    - [x] 개별 아이콘 import로 변경
    - [x] react-icons와 @react-icons/all-files 비교해보기
- [x] 같은 건 매번 새로 요청하지 않기
  - [x] CDN 적용
    - [x] 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
    - [x] S3, CloudFront 캐시 설정을 적용한다
  - [x] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.
    - [x] cache 스토리지 이용
    - [x] cache 스토리지 wrapping 함수 제작 및 적용
- [ ] 최소한의 변경만 일으키기
  - [x] 검색 결과 > 추가 로드시 추가되는 결과에 대해서만 화면 업데이트가 새로 일어나야 한다.
    - [x] React DevTools의 Profiler 기준으로 기존에 있던 아이템이 다시 렌더되지 않는지 확인
    - [x] -> GifItem React.memo 적용
  - [ ] Layout Shift 없이 애니메이션이 일어나야 한다.
    - [ ] (대상) CustomCursor, 검색 결과 > hover, 도움말 패널 열고닫기 애니메이션
  - [ ] Frame Drop이 일어나지 않아야 한다. (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.
    - [ ] (대상) 메인 페이지의 CustomCursor, 스크롤 애니메이션
