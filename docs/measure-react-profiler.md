# 측정 절차: React Profiler (렌더 범위)

React DevTools Profiler로 **한 번의 상태 변경에서 어떤 컴포넌트가 다시 렌더됐는지**를 측정하는 절차다.
TODO 4번의 "검색 결과 > 추가 로드시 추가된 목록만 새로 렌더되어야 한다"를 판정하는 근거를 만든다.

Performance 탭이 "화면에 그려졌는가(프레임)"를 본다면 여기서는 "React가 몇 개를 다시 그렸는가(렌더 범위)"를 본다. 서로 다른 층이므로 같이 측정한다([measure-performance.md](./measure-performance.md)).

## 사전 준비

### 1. React Developer Tools 확장 설치

Chrome 웹스토어에서 설치한다. 설치하면 DevTools에 **Components**와 **Profiler** 탭이 생긴다.

### 2. 이 측정만 로컬 개발 서버에서 한다

배포본은 프로덕션 React 빌드라 Profiler 탭에 아래 안내만 뜨고 기록이 되지 않는다.

```
Profiling support requires either a development or profiling build of React v16.5+
```

그래서 다른 측정과 달리 **로컬 개발 서버**를 쓴다.

```bash
npm run serve
```

터미널에 표시된 주소(기본 `http://localhost:8080`)를 연다. 로컬은 `src/App.tsx`의 `basename`이 주석 처리되어 있어 `http://localhost:8080/search`로 바로 들어갈 수 있다.
Search 페이지 목록이 뜨려면 `.env`의 `GIPHY_API_KEY`가 설정되어 있어야 한다.

> 개발 빌드는 프로덕션보다 렌더가 느리다. **렌더 시간(ms) 절대값은 비교 대상이 아니다.** 이 측정에서 보는 것은 "몇 개가, 왜 렌더됐는가"뿐이다.

> 시크릿 창에서는 확장이 꺼져 있을 수 있으므로 **일반 창**에서 측정한다. 점수가 아니라 렌더 횟수를 보는 측정이라 확장 프로그램의 영향이 없다.

### 3. Profiler 설정

DevTools → **Profiler** 탭 → 톱니(⚙)

| 탭 | 옵션 | 값 |
| --- | --- | --- |
| General | Highlight updates when components render | 체크 |
| Profiler | Record why each component rendered while profiling | 체크 |

두 번째 옵션을 켜야 각 컴포넌트가 **왜** 렌더됐는지(props 변경 / state 변경 / 부모 렌더)를 볼 수 있다.

## 1. Highlight updates로 먼저 훑기

수치를 재기 전에 범위를 눈으로 확인한다.

1. Search 페이지를 연다. trending 결과 16개가 뜰 때까지 기다린다.
2. **load more** 버튼을 누른다.
3. 리렌더된 컴포넌트마다 테두리가 번쩍인다.

   | 관찰 | 판정 |
   | --- | --- |
   | 기존 16개 카드에도 테두리가 번쩍임 | 전체 리렌더. TODO 4번 미달 |
   | 새로 추가된 16개에만 번쩍임 | 통과 |

4. 캡처: `docs/images/react-highlight-loadmore-{before|after}.png`

정성 확인이다. 수치는 2번에서 만든다.

## 2. 프로파일 기록 (load more)

1. Search 페이지에서 목록 16개가 뜬 상태로 시작한다. `src/apis/gifAPIService.ts`의 `DEFAULT_FETCH_COUNT`가 16이라 load more 1회당 16개가 추가된다.
2. Profiler 탭에서 ● Record.
3. **load more 버튼을 1회만** 클릭한다.
4. 목록이 늘어나면 ■ Stop.

## 3. 읽는 법

상단에 **커밋 막대**가 나온다. 막대 하나가 DOM에 반영된 렌더 한 번이다.

1. **커밋 수**를 센다. `useGifSearch.tsx`의 `loadMore`는 `setGifList`와 `setCurrentPageIndex`를 연달아 호출하는데, React 18의 automatic batching이 걸리면 1커밋으로 묶인다. 2개 이상 잡히면 그 자체가 기록 대상이다.
2. 가장 높은(오래 걸린) 커밋을 클릭한다.
3. **Flamegraph** 탭

   | 표시 | 의미 |
   | --- | --- |
   | 회색 막대 | 이번 커밋에서 렌더되지 않음 |
   | 색이 있는 막대 | 렌더됨. 너비가 렌더 시간 |

   `SearchResult` 아래 `GifItem`이 32개 모두 색으로 차 있으면 기존 16개까지 다시 렌더된 것이다.
4. **Ranked** 탭 — 렌더된 컴포넌트만 오래 걸린 순으로 나온다. 행 수가 곧 렌더된 컴포넌트 수다.
5. 컴포넌트를 클릭하면 우측에 **Why did this render?**가 나온다. `The parent component rendered`, `Props changed (imageUrl, title)` 같은 식으로 원인이 찍힌다.

기록할 값 — 리포트 §5-3에 옮긴다.

| 항목 | 읽는 위치 |
| --- | --- |
| 커밋 수 | 상단 막대 개수 |
| 렌더된 컴포넌트 수 | Ranked 탭 행 수 |
| 기존 목록 아이템 리렌더 여부 | Flamegraph에서 추가 전 16개 `GifItem`이 회색인지 |
| 리렌더 원인 | Why did this render? |
| 커밋 소요 시간 | 커밋 막대 툴팁 (참고값. 개발 빌드 기준) |

## 4. 같은 방법으로 볼 다른 구간

TODO 4번의 Frame Drop 원인을 코드 쪽에서 뒷받침하는 데 쓴다. 절차는 2~3번과 같다.

| 구간 | 동작 | 확인할 것 |
| --- | --- | --- |
| Home 마우스 이동 | Record → 히어로 위에서 마우스 3초 흔들기 → Stop | `CustomCursor`가 mousemove마다 커밋을 만드는가. 커밋 수를 센다 |
| Home 스크롤 | Record → featureSection까지 스크롤 → Stop | `AnimatedPath`의 커밋 수. 스크롤 이벤트 수와 비슷하면 프레임마다 리렌더하는 것이다 |
| 검색어 입력 | Record → 검색창에 5글자 입력 → Stop | 글자마다 `SearchResult`와 `GifItem`까지 렌더되는가 |

## 5. 원본 저장

1. 대표 커밋의 Flamegraph가 보이게 캡처한다.
   - 저장: `docs/images/react-profiler-{loadmore|cursor|scroll}-{before|after}.png`
2. Profiler 좌상단 ⬇(Save profile)로 원본을 남긴다. 개선 후 ⬆로 불러와 나란히 비교할 수 있다.
   - 저장: `docs/react-profiler/{loadmore|cursor|scroll}-{before|after}.json`

## 결과 읽는 법

- **기존 아이템까지 렌더됐고 원인이 `The parent component rendered`** → 부모가 리렌더되면서 자식이 전부 따라 렌더된 것이다. `React.memo` 대상이다.
- **`React.memo`를 붙였는데도 렌더되고 원인이 `Props changed`** → 매 렌더마다 새로 만들어지는 값(객체, 배열, 인라인 함수)이 props로 내려가고 있다. `SearchResult`의 `loadMore` 같은 핸들러가 후보다.
- **커밋 수가 동작 횟수보다 많다** → 하나의 동작에서 상태를 여러 번 나눠 바꾸고 있다. 묶을 수 있는지 본다.
- **렌더 시간은 줄지 않았는데 렌더된 컴포넌트 수가 줄었다** → 목표는 달성된 것이다. 개발 빌드의 시간 값은 판정 기준이 아니다.

## 주의

- 개발 서버는 HMR이 켜져 있다(`webpack.config.js`의 `devServer.hot`). 측정 중 소스 파일을 저장하면 그 리렌더가 프로파일에 섞인다. 녹화 중에는 에디터를 건드리지 않는다.
- `src/index.tsx`에 `StrictMode`가 없어 개발 모드 이중 렌더는 발생하지 않는다. 나중에 `StrictMode`를 추가하면 커밋 수가 2배로 보일 수 있으니 개선 전/후 측정 시 이 조건을 동일하게 둔다.
- 개선 후 측정도 **같은 로컬 개발 서버**에서 한다. 개선 전은 dev, 개선 후는 배포본처럼 섞으면 비교가 성립하지 않는다.
- 판정 기준은 렌더 시간이 아니라 **렌더 범위**다. TODO 4번의 문장 자체가 "추가된 목록만 새로 렌더되어야 한다"이다.
