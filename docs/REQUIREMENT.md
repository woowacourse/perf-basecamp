## 미션 요구사항

### 개선 목표

• Desktop 기준

- [ ] Lighthouse performance 95점 이상
- [ ] Home 페이지에서 불러오는 스크립트 리소스 크기 < 60kb
- [ ] 히어로 이미지 크기 < 120kb
- [ ] 프랑스 파리에서 Fast 3G 환경으로 접속했을 때

  - [ ] Home 첫 번째 로드시 LCP < 2.5s
  - [ ] Home 두 번째 이후 로드시 LCP < 1.2s

- [ ] CPU 6x slowdown Network Fast 3G 환경에서
      화면 버벅임 최소화

  - Dropped Frame 없음.

  - Partially Presented Frame 최소화.

### 필수사항

1. 요청 크기 줄이기

   - [ ] 소스코드 크기 줄이기
   - [ ] 이미지 크기 줄이기

2. 필요한 것만 요청하기

   - [ ] Home 페이지에서 불러오는 스크립트 리소스에 gif 검색을 위한 giphy 모듈이 포함되어 있지 않아야 한다.
   - [ ] react-icons 패키지에서 실제로 사용하는 아이콘 리소스만 빌드 결과에 포함되어야 한다.

3. 같은 건 매번 새로 요청하지 않기

   - [ ] CDN을 적용하고, 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
     - 캐시 정책을 직접 설정한다.
   - [ ] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.
     - '검색'을 더 주요 기능으로 취급하여, trending 정보가 '실시간으로' 업데이트될 필요는 없다고 가정한다.

4. 최소한의 변경만 일으키기

   - [ ] 검색 결과 > 추가 로드시 추가되는 결과에 대해서만 화면 업데이트가 새로 일어나야 한다.
     - React DevTools의 Profiler 기준으로 기존에 있던 아이템이 다시 렌더되지 않는지 확인
   - [ ] Layout Shift 없이 애니메이션이 일어나야 한다.
     - (대상) CustomCursor, 검색 결과 > hover, 도움말 패널 열고닫기 애니메이션
   - [ ] Frame Drop이 일어나지 않아야 한다.
     - (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.

#### 선택사항

- [ ] 도움말 패널 추가 최적화

### 참고 사항

아래 경로의 파일들만 수정하셔도 요구사항은 모두 만족할 수 있습니다.

- App.tsx
- webpack.config.js
- apis/
- Home/
- Search/components/