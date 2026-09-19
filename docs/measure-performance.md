# 측정 절차: Performance (프레임 / Layout Shift)

Chrome DevTools Performance 탭으로 **로드가 끝난 뒤 인터랙션 중**의 프레임 드롭과 Layout Shift를 측정하는 절차다.
Lighthouse의 CLS는 로드 구간만 재기 때문에 0이 나와도 호버·스크롤·패널 애니메이션 중 시프트는 잡히지 않는다. TODO 4번(최소한의 변경만 일으키기)의 근거는 이 문서로 만든다.

## 사전 준비

- [measure-lighthouse.md](./measure-lighthouse.md)와 같이 **배포된 주소**를 **시크릿 창**에서 연다.
- **페이지 로드가 완전히 끝난 뒤** 녹화를 시작한다. `hero.png`가 10MB라 로드 중에 녹화하면 이미지 디코딩이 프레임 트랙을 덮어버려 애니메이션 문제를 구분할 수 없다.
- Search 페이지는 배포 주소에서 **직접 진입이 안 된다**. `https://geongyu09.github.io/perf-basecamp/search`는 404다(GitHub Pages에 SPA fallback이 없다). Home에서 **start search 버튼을 눌러** 이동한 뒤 측정한다.

### 측정 시나리오

| ID | 페이지 | 동작 | 관련 코드 | 확인 대상 |
| --- | --- | --- | --- | --- |
| S1 | Home | 히어로 위에서 마우스 좌우 왕복 5초 | `CustomCursor.tsx`, `useMousePosition.tsx` | Frame Drop |
| S2 | Home | 최상단 → featureSection 끝까지 스크롤 5초 | `AnimatedPath.tsx`, `useScrollEvent.tsx` | Frame Drop, 강제 동기 레이아웃 |
| S3 | Search | 결과 카드 5개 순서대로 호버 | `GifItem.module.css` | Frame Drop, Layout Shift |
| S4 | Search | 우하단 버튼으로 HelpPanel 열기/닫기 3회 | `HelpPanel.module.css` | Frame Drop, Layout Shift |
| S5 | Search | load more 1회 클릭 | `SearchResult.tsx` | Frame Drop (렌더 범위는 React Profiler로) |

## 0. 공통 설정

1. DevTools(⌥⌘I) → **Performance** 탭.
2. 상단 톱니(⚙)를 눌러 아래처럼 맞춘다.

   | 옵션 | 값 | 이유 |
   | --- | --- | --- |
   | Screenshots | 체크 | 프레임과 화면을 대조해 어느 동작에서 끊겼는지 찾는다 |
   | CPU | **6x slowdown** | 리포트 측정 환경과 동일하게 맞춘다. 스로틀링이 없으면 프레임 드롭이 재현되지 않는다 |
   | Network | No throttling | 로드가 아니라 인터랙션을 재므로 끈다 |

3. (선택) ⌘⇧P → `Show Rendering` → **Frame Rendering Stats** 체크. 화면 우상단에 실시간 FPS와 드롭 프레임 수가 뜬다. 녹화 전에 어느 동작이 문제인지 빠르게 훑을 때 쓴다.

## 1. 녹화

시나리오 하나당 한 번 녹화한다. 여러 동작을 한 녹화에 섞으면 프레임 원인을 분리할 수 없다.

### 공통 순서

1. 시나리오의 **시작 상태**를 만든다. 페이지 로드가 끝나고 이미지·GIF가 모두 뜬 상태여야 한다.
2. ● Record(⌘E)를 누른다.
3. **1초 정지 → 시나리오 동작 → 1초 정지** 순서로 진행한다. 앞뒤 정지 구간이 기준선이 된다. 이 구간에도 드롭이 있으면 그건 시나리오 동작 때문이 아니라 페이지가 상시로 만드는 부하다.
4. ■ Stop(⌘E).
5. 녹화 중에는 DevTools 창을 클릭하거나 다른 탭으로 전환하지 않는다. 포커스가 바뀌면 렌더링이 스로틀링된다.

아래 시나리오별 요령은 **시작 상태 / 동작 / 하지 말 것 / 확인할 것** 순서다. "하지 말 것"은 측정을 망치는 동작이므로 그대로 지킨다.

### S1 — Home 마우스 이동

**시작 상태**

- Home 최상단(스크롤 0). `hero.png`와 GIF 3개가 모두 뜬 뒤.
- 포인터를 히어로 섹션 **왼쪽 끝**에 올려두고 멈춘다.

**동작**

1. Record → **1초 정지**. `CustomCursor`의 `wave-text` 애니메이션만 도는 기준선 구간이다.
2. 히어로 이미지 위를 **왼쪽 끝 ↔ 오른쪽 끝** 수평으로 왕복한다. 1회 왕복 약 1초, **5회 왕복 = 5초**.
3. 다시 **1초 정지** → Stop.

**하지 말 것**

- **도중에 멈추기.** `mousemove`는 포인터가 움직일 때만 발생한다. 멈춘 구간은 이벤트가 0이라 측정이 희석된다. 5초 내내 움직인다.
- **포인터를 히어로 섹션 밖이나 DevTools 창으로 빼기.** 이벤트가 끊긴다. 높이 `46.5rem`(744px) 안에서만 움직인다.
- **매번 다른 속도·거리로 움직이기.** 개선 전후의 이벤트 수가 달라져 비교가 성립하지 않는다. 왕복 횟수를 세면서 한다.

**확인할 것**

- Main 트랙에 프레임 간격으로 같은 모양의 짧은 작업이 반복된다. 덩어리 안에 `Event: mousemove` → 핸들러 → `Recalculate Style` → `Layout` 순서가 들어 있다.
- 앞뒤 1초 정지 구간과 비교한다. 드롭이 **움직이는 구간에만** 몰려 있어야 원인이 `CustomCursor`로 확정된다.

### S2 — Home 스크롤

**시작 상태**

- Home 최상단.
- 히어로 섹션의 **빈 공간**을 한 번 클릭해 문서에 키보드 포커스를 준다. `start search` 버튼은 누르지 않는다. Search 페이지로 이동해 버린다.

**동작**

1. Record → **1초 정지**.
2. `↓` 키를 **누른 채로 5초 유지**한다. 키 리피트로 일정한 속도로 스크롤된다.
3. Stop.

선이 그려지는 구간은 `featureSection`이다. 5초 안에 거기까지 도달해야 의미가 있다. 부족하면 `Page Down`을 일정 간격으로 눌러도 되지만, 개선 전후에 **같은 방식**을 쓴다.

**하지 말 것**

- **트랙패드 스와이프나 휠 플릭.** 관성 스크롤이라 매번 이동 거리와 감속 곡선이 달라진다. 전후 비교가 안 된다. 키 리피트는 고정 속도다.
- **`Space` 키.** 한 번에 한 화면씩 건너뛰어 스크롤이 끊긴다. 연속 구간이 필요하다.
- **스크롤 도중 마우스 움직이기.** S1이 섞인다.

**확인할 것**

- Main 트랙에 `Event: scroll` 덩어리가 반복되고 그 안에 `Layout`이 들어 있다.
- 덩어리 우상단의 **보라 삼각형**과 Summary의 `Forced reflow is a likely performance bottleneck`을 찾는다. `AnimatedPath.tsx:28`의 `getTotalLength()`와 `wrapper.offsetTop` 읽기가 원인 후보다.
- 히어로 구간(선이 아직 안 그려지는 구간)에서도 핸들러가 도는지 본다. 화면에 변화가 없는데 도는 작업이면 그대로 낭비다.

### S3 — Search 결과 카드 호버

**시작 상태**

- Home에서 `start search` 버튼으로 Search에 진입한다(배포 주소는 `/search` 직접 진입이 404).
- trending 16개가 모두 뜨고 GIF 재생이 시작될 때까지 기다린다.
- 포인터를 결과 그리드 **바깥**(검색창 옆 여백)에 둔다.

**동작**

1. Record → **1초 정지**. 결과 GIF는 계속 재생되므로 이 구간에도 페인트가 있다. **이 양을 알아야 호버 비용을 분리할 수 있다.**
2. 첫 줄 카드를 1 → 2 → 3 → 4 → 5 순서로 옮긴다. 카드마다 **0.5초 정지**해 0.2초 트랜지션이 끝나게 둔다. 총 5초.
3. 포인터를 그리드 밖으로 빼고 **1초 정지** → Stop.

**하지 말 것**

- **카드 위를 빠르게 쓸기.** 트랜지션이 매번 다른 지점에서 취소되어 재현이 안 된다.
- **카드 사이 여백에서 멈추기.** 호버가 풀려 의도하지 않은 이탈 트랜지션이 생긴다. 항상 카드 안에서 멈춘다.

**확인할 것**

- 호버 진입과 이탈 시점마다 0.2초 길이의 `Recalculate Style` + `Layout` 반복 구간이 생긴다. 진입 5회 + 이탈 5회 = 10개 구간이 보여야 한다.
- 1번의 기준선 구간과 **차이**로 판정한다. GIF 재생만으로도 이미 페인트가 깔려 있으므로 절대 개수로 보면 안 된다.

### S4 — Search HelpPanel 열기/닫기

**시작 상태**

- Search 페이지, 결과 16개가 뜬 상태. 패널은 닫혀 있다.
- **녹화 전에 한 번 열었다 닫아둔다.** 패널 안 GIF 2개는 외부(giphy.com)에서 받아오는데, 첫 열기에 디코딩 비용이 섞이면 2회차부터와 수치가 달라진다.

**동작**

1. Record → **1초 정지**.
2. 우하단 원형 info 버튼을 클릭한다. 패널이 오른쪽에서 슬라이드 인 → **1초 대기**(0.5초 트랜지션 + 여유).
3. 패널 상단 우측 X 버튼을 클릭한다. 슬라이드 아웃 → **1초 대기**.
4. 2~3을 **3회** 반복 → Stop.

**하지 말 것**

- **트랜지션이 끝나기 전에 다음 클릭.** 0.5초를 다 채우고 누른다. 중간에 끊으면 역방향 트랜지션이 겹쳐 구간을 셀 수 없다.
- **버튼으로 이동하면서 클릭.** 열기 버튼(우하단)과 닫기 버튼(패널 상단)의 위치가 달라 포인터 이동이 생긴다. 이동을 멈춘 뒤 누른다.

**확인할 것**

- 0.5초 길이 구간이 6개(열기 3 + 닫기 3) 반복된다.
- `right`가 변하므로 프레임마다 `Layout`이 돈다. 여기에 `backdrop-filter: blur(5px)`의 페인트가 얹힌다. Bottom-Up에서 `Layout`과 `Paint` 비중을 같이 본다.
- Experience 트랙에 시프트가 찍히는지 본다. 패널이 `position: fixed`라 문서 흐름은 안 밀리지만, 열릴 때 스크롤바가 생기면 잡힌다.

### S5 — Search load more

**시작 상태**

- Search 페이지, 목록 16개.
- **녹화 전에** 페이지를 내려 `load more` 버튼이 보이게 해둔다. 녹화 중에 스크롤하면 S2가 섞인다.

**동작**

1. Record → **1초 정지**.
2. `load more`를 **1회만** 클릭한다.
3. 새 카드 16개가 뜨고 GIF 재생이 시작될 때까지 대기한다(2~3초).
4. **1초 더** 둔 뒤 Stop.

**하지 말 것**

- **여러 번 클릭.** 커밋이 섞여 어느 렌더의 비용인지 가릴 수 없다.
- **응답 대기 중 스크롤이나 마우스 이동.**

**구간 선택 요령** — 이 시나리오만 다르다

클릭부터 GIPHY 응답 도착까지는 **네트워크 대기**라 프레임 작업이 거의 없다. 이 구간을 포함해 세면 드롭 비율이 희석되고, 게다가 응답 시간은 측정할 때마다 달라서 전후 비교가 무너진다.

1. Network 트랙에서 GIPHY 요청이 끝나는 지점을 찾는다.
2. **그 직후부터 1초**만 드래그 선택해서 센다. 카드 32개 리렌더와 새 이미지 레이아웃이 이 구간에 몰린다.
3. 선택 구간의 시작·끝 기준을 리포트에 함께 적는다. 개선 후에도 같은 기준으로 잘라야 한다.

**확인할 것**

- 응답 직후에 한 덩어리의 긴 작업이 보인다. 50ms를 넘으면 Long Task로 빨간 삼각형이 붙는다.
- 여기서 **몇 개 컴포넌트가 렌더됐는지**는 Performance 탭으로 알 수 없다. [measure-react-profiler.md](./measure-react-profiler.md)로 따로 잰다. 이 시나리오는 두 문서를 같이 봐야 결론이 난다.

## 2. Dropped / Partially Presented Frame 세기

1. 타임라인 상단 **Frames** 트랙을 본다. 안 보이면 트랙 목록에서 접혀 있는지 확인한다.
2. 색으로 구분한다. 마우스를 올리면 툴팁에 종류와 지속 시간이 그대로 표시된다.

   | 표시 | 의미 | 판정 |
   | --- | --- | --- |
   | 초록/회색 블록 | 정상 프레임 | OK |
   | **빨간 블록** | **Dropped Frame** — 화면에 아예 그리지 못한 프레임 | TODO 기준 0이어야 함 |
   | **노란 빗금** | **Partially Presented Frame** — 일부만 그려진 프레임 | 최소여야 함 |

3. 시나리오 동작 구간만 드래그로 선택한 뒤 그 구간의 빨간/노란 프레임 개수를 센다. 앞뒤 여유 구간은 빼고 센다.
4. 선택 구간과 개수를 리포트 §5-1에 시나리오별로 기록한다.

## 3. Layout Shift 확인

1. **Experience** 트랙(최신 Chrome에서는 별도 **Layout Shifts** 트랙)에 빨간 블록이 있으면 그 시점에 시프트가 일어난 것이다.
2. 블록을 클릭하면 Summary에 아래가 나온다.

   | 항목 | 의미 |
   | --- | --- |
   | Score | 이 시프트의 CLS 기여도 |
   | Had recent input | `true`면 사용자 입력 직후라 CLS 점수에서는 제외된다. **점수에서 빠질 뿐 화면은 실제로 밀렸다.** TODO 4번은 점수가 아니라 현상이 기준이므로 이것도 기록한다 |
   | Moved from / to | 어느 요소가 어디로 밀렸는지 |

3. 눈으로 확인하려면 ⌘⇧P → `Show Rendering` → **Layout Shift Regions** 체크. 시프트가 일어난 영역이 파란색으로 깜빡인다. 시나리오를 다시 수행하며 어디가 밀리는지 본다.
4. 발생 위치 / Score / 원인을 리포트 §5-2에 기록한다.

## 4. 원인 찾기 — Main 트랙

1. 빨간 프레임이 깔린 구간의 **Main** 트랙을 본다.
2. 확인할 것

   | 표시 | 의미 | 이 프로젝트에서 의심되는 곳 |
   | --- | --- | --- |
   | 작업 블록 우상단 빨간 삼각형 | Long Task (50ms 초과) | 스크롤 / 마우스 이동 핸들러 |
   | `Recalculate Style`, `Layout`이 매 프레임 반복 | 레이아웃 트리거 속성을 애니메이션 중 | `top` / `left` / `right` 변경 |
   | 보라 삼각형 + Summary의 `Forced reflow is a likely performance bottleneck` | 강제 동기 레이아웃 | `AnimatedPath.tsx`의 `getTotalLength()`. 스크롤 핸들러에서 매번 호출한다 |

3. 구간을 선택하고 하단 **Bottom-Up** 탭에서 `Layout`, `Recalculate Style`, `Paint`의 비중을 본다. 이 셋이 상위면 렌더링 파이프라인 문제고, JS 함수가 상위면 핸들러 자체가 문제다.

## 5. CSS triggers로 원인 속성 분류

프레임이 깨진 구간에서 어떤 CSS 속성이 애니메이션되는지 확인하고, 그 속성이 렌더링 파이프라인 어디까지 유발하는지 분류한다. 속성별 단계는 <https://csstriggers.com/>에서 볼 수 있다.

| 유발 단계 | 속성 예 | 비용 |
| --- | --- | --- |
| Layout → Paint → Composite | `top`, `left`, `right`, `width`, `height`, `margin` | 가장 비쌈. 매 프레임 레이아웃을 다시 계산한다 |
| Paint → Composite | `background`, `box-shadow`, `border-radius` | 중간 |
| Composite만 | `transform`, `opacity` | 가장 쌈. 목표 지점 |

코드에서 확인된 대상이다. 측정 후 실제 프레임 결과와 대조한다.

| 대상 | 변경되는 속성 | 유발 단계 |
| --- | --- | --- |
| `CustomCursor.tsx:17-18` | `style.top`, `style.left` | Layout |
| `GifItem.module.css:12,16` | `transition: all` + `top` | Layout |
| `HelpPanel.module.css:23,26` | `transition: all` + `right`, `opacity` | Layout |
| `Home.module.css:61`, `SearchResult.module.css:28` | `transition: all` (버튼) | 실제로 바뀌는 속성에 따라 다름 |
| `CustomCursor.module.css:25` | `transform` (wave-text) | Composite |

`transition: all`은 변경되지 않은 속성까지 트랜지션 후보로 두므로, 실제로 바뀌는 속성만 명시되어 있는지도 함께 기록한다.

## 6. 원본 저장

1. Frames 트랙과 선택 구간이 보이게 캡처한다.
   - 저장: `docs/images/performance-frames-{S1~S5}-{before|after}.png`
2. Layout Shift가 잡힌 시나리오는 Experience 트랙과 Summary가 보이게 캡처한다.
   - 저장: `docs/images/performance-cls-{S1~S5}-{before|after}.png`
3. 좌상단 ⬇(Save profile)로 프로파일 원본을 남긴다. 개선 후 같은 구간과 비교할 때 쓴다.
   - 저장: `docs/performance/{S1~S5}-{before|after}.json`

## 결과 읽는 법

- **Dropped Frame이 연속으로 깔린다** → 매 프레임 레이아웃이 다시 돈다는 뜻이다. 4번에서 `Layout`이 반복되는지, 5번에서 애니메이션 속성이 Layout 트리거인지 확인한다.
- **Long Task가 있고 그 구간에만 드롭이 있다** → 애니메이션이 아니라 이벤트 핸들러의 JS가 원인이다. 스로틀/디바운스나 `requestAnimationFrame`으로 옮길 대상이다.
- **`Forced reflow` 경고** → 읽기(`getTotalLength()`, `offsetTop`)와 쓰기(`setState` 이후 스타일 변경)가 한 프레임에 섞였다는 뜻이다. 읽은 값을 캐시하면 사라진다.
- **`Had recent input: true`인 시프트** → Lighthouse CLS에는 안 잡히지만 TODO 4번의 "Layout Shift 없이"에는 위배된다. 반드시 기록한다.

## 주의

- CPU 스로틀링 배수가 다르면 프레임 수가 통째로 달라진다. 개선 전/후 모두 **6x**로 고정한다.
- 배터리 절약 모드, 다른 탭의 영상 재생, 빌드 실행 중에는 측정하지 않는다.
- 같은 시나리오를 **3회 녹화해 중앙값**을 쓴다. 프레임 수는 1회 측정 편차가 크다.
- Frame Rendering Stats(FPS 미터)는 빠른 확인용이다. 리포트 수치는 Performance 녹화의 Frames 트랙에서 센 값을 쓴다.
