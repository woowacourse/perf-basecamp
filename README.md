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

#### 2 필요한 것만 요청하기

- [x] Home 페이지에서 불러오는 스크립트 리소스에 gif 검색을 위한 giphy 모듈이 포함되어 있지 않아야 한다.
- [x] react-icons 패키지에서 실제로 사용하는 아이콘 리소스만 빌드 결과에 포함되어야 한다.

#### 3 같은 건 매번 새로 요청하지 않기

- [x] CDN을 적용하고, 한 번 요청한 리소스는 CDN 캐시에서 불러와야 한다.
- [x] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.

#### 4 최소한의 변경만 일으키기

- [x] 검색 결과 > 추가 로드시 추가된 목록만 새로 렌더되어야 한다.
- [x] Layout Shift 없이 애니메이션이 일어나야 한다.
- [x] Frame Drop이 일어나지 않아야 한다.
  - (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.
