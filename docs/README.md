# 성능 최적화

## 요구사항

- [ ] Lighthouse 95점 이상
- [ ] Home 페이지에서 불러오는 스크립트 리소스 크기 < 60kb
- [ ] 히어로 이미지 크기 < 120kb
- [ ] 프랑스 파리에서 Fast 3G 환경으로 접속했을 때 Home 두 번째 이후 로드시 LCP < 1.2s
- [ ] WebPageTest에서 Paris - EC2 Chrome CPU 6x slowdown Network Fast 3G 환경 기준으로 확인
- [ ] Chrome CPU 6x slowdown Network Fast 3G 환경에서 화면 버벅임 최소화
- [ ] Dropped Frame 없음. Partially Presented Frame 최소화.

## 결과

- 배포한 CloudFront 접근 경로:
- 개선 전후 성능 측정 결과
  - 개선 전 (S3)
  - 개선 후 (CloudFront)

## 작업 목록

### 요청 크기 줄이기

- [ ] 소스코드 크기 줄이기
- [ ] 이미지 크기 줄이기
  - ImageMinimizerPlugin를 사용

### 필요한 것만 요청하기

- [x] 페이지별 리소스 분리
- [x] 아이콘 패키지 Tree Shaking

### 같은 건 매번 새로 요청하지 않기

- [ ] CloudFront 캐시 설정 (설정값, 해당 값을 설정한 이유 포함)
- [ ] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.

### 최소한의 변경만 일으키기

- [ ] 검색 결과 > 추가 로드시 추가된 목록만 새로 렌더되어야 한다.
- [ ] Layout Shift 없이 애니메이션이 일어나야 한다.
- [ ] Frame Drop이 일어나지 않아야 한다.
      (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.
