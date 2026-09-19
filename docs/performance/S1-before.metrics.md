# S1 (Home 마우스 이동) — 개선 전 측정 지표

> 원본 트레이스: `S1-before-run{1,2,3}.json.gz` (git 제외, DevTools에서 `.gz` 그대로 로드 가능)
> 측정일: 2026-09-19 / 3회 측정 후 중앙값

## 측정 환경

| 항목 | 값 |
| --- | --- |
| 측정 URL | `https://geongyu09.github.io/perf-basecamp` (배포 주소) |
| CPU 스로틀링 | 6x slowdown |
| Network 스로틀링 | 없음 |
| 디스플레이 | 120Hz (프레임 예산 8.33ms) |
| 확장 프로그램 | 1개 잔존 (`fjdhphbdlfjo…`, 37~43ms = 전체 0.9% 내외) |
| 측정 횟수 | 3회 |

## 3회 측정 결과

| 항목 | run1 | run2 | run3 | **중앙값** |
| --- | --- | --- | --- | --- |
| 이동 구간 길이 | 4.30s | 4.50s | 5.52s | 4.50s |
| mousemove | 504 | 503 | 621 | 504 |
| mousemove / 초 | 117.2 | 111.8 | 112.5 | 112.5 |
| `Layout` | 500 | 496 | 588 | 500 |
| `Layout` / 초 | 116.2 | 110.2 | 106.5 | 110.2 |
| **mousemove당 `Layout`** | 0.992 | 0.986 | 0.947 | **0.986** |
| Dropped Frame (빨강) | 0 | 2 ※ | 0 | **0** |
| Partially Presented (노랑) | 10 | 30 ※ | 10 | **10** |
| mousemove 태스크 중앙값 | 4.69ms | 4.83ms | 4.28ms | **4.69ms** |
| mousemove 태스크 p95 | 6.00ms | 6.61ms | 5.55ms | **6.00ms** |
| 메인 스레드 점유 | 67.1% | 69.2% | 58.4% | **67.1%** |
| 앱 JS 시간 | 575.0ms | 571.3ms | 616.8ms | 575.0ms |
| 강제 동기 레이아웃 | 0/500 | 0/496 | 0/588 | **0** |

※ run2 주의 — 아래 "run2 이상치" 참조. 측정 자체의 결함이며 코드 문제가 아니다.

## 기준선 (정지 구간) — 3회 전부 동일

| 항목 | run1 (1.38s) | run2 (1.57s) | run3 (1.28s) |
| --- | --- | --- | --- |
| `Layout` | **0회** | **0회** | **0회** |
| `Paint` | **0회** | **0회** | **0회** |
| Dropped / Partial Frame | 0 / 0 | 0 / 0 | 0 / 0 |
| `Recalculate Style` | 54 (39.1/s) | 69 (43.9/s) | 49 (38.3/s) |
| 메인 스레드 점유 | 14.6% | 16.4% | 18.1% |

**정지 상태에서 `Layout`과 `Paint`가 3회 모두 정확히 0이다.**
`wave-text`는 `transform` 애니메이션이라 컴포지터에서만 돈다 (csstriggers 분류대로다).
마우스를 움직이는 순간에만 `Layout`이 발생하므로 원인이 `CustomCursor`로 확정된다.

## 호출 체인 (run1 실측, 3회 모두 동일 패턴)

```
mousemove 504회
  └ updateMousePosition          504회  (bundle.js:10230)
      └ React 스케줄러 flush      504회  (R @bundle.js:1895)
          └ style.top / left 쓰기
              └ Layout            500회
```

- `Layout` 중 **99%가 `WebFrameWidgetImpl::HandleInputEvent` 안**에서 동기 실행된다
  (run1 495/500, run2 491/496, run3 581/588)
- 모든 `Layout`이 `dirtyObjects: 1` / `totalObjects: 71` / `layoutRoots: #document`
  → 커서 div 하나가 더러워졌을 뿐인데 문서 전체 레이아웃 패스가 돈다

## 프레임 예산 대비 (8.33ms)

| mousemove를 포함한 RunTask | 중앙값 기준 | 예산 대비 |
| --- | --- | --- |
| 중앙값 | 4.69ms | 56% |
| p95 | 6.00ms | 72% |
| 최대 (run1 / run3) | 8.53ms / 7.92ms | 102% / 95% |

마우스 이동 1회가 프레임 예산의 절반 이상을 먹는다. 최대값이 예산 경계에 닿아 부분 프레임이 발생한다.

## run2 이상치 — 측정 결함

run2의 Dropped 2 / Partial 30은 **마우스 이동 때문이 아니다.**

- 1,596ms 지점에 **104.9ms짜리 RunTask**가 있고, 그중 **`Commit`이 98.27ms**다 (컴포지터 레이어 커밋)
- 이 한 번의 커밋이 1,599~1,733ms 구간에 프레임 15개를 연속으로 깨뜨렸다
- **완전 드롭 2개(1,725ms / 1,733ms)가 모두 이 버스트 안에 있다**
- 이 버스트를 제외하면 run2도 partial 17개 / fully dropped **0개**

원인은 녹화 시작 시점에 페이지가 아직 안정되지 않은 것이다
(`measure-performance.md` §사전준비 "페이지 로드가 완전히 끝난 뒤 녹화를 시작한다" 위반).
→ **결론: 3회 모두 완전 드롭 0, 부분 프레임 10개 수준.**

## 해당 없음 — 리포트 S1 행에 쓰지 말 것

| 항목 | 결과 |
| --- | --- |
| 강제 동기 레이아웃 (Forced reflow) | **3회 모두 0**. 앱 코드에서 발생하지 않는다 |
| Long Task (>50ms) | 마우스 이동 때문인 것은 **0개**. 각 회차 140~161ms 태스크가 있으나 전부 페이지 로드 직후다 |

→ 판정은 "Long Task" 분기가 아니라 **"매 프레임 레이아웃이 다시 돈다"** 분기다.

## 비교 지표 선택

`Layout` 초당 횟수는 **손 움직임 속도에 비례**하므로 전후 비교에 부적합하다.
3회 측정에서 mousemove 빈도가 111.8 ~ 117.2/s로 흔들렸고 `Layout`/s도 따라 흔들렸다.

반면 **mousemove당 `Layout`은 0.947 ~ 0.992로 안정적이다.**
폐기한 localhost 측정(0.98)까지 넣어도 같은 범위다.

→ 개선 전후 비교의 **주 지표는 `mousemove당 Layout`**. 손 속도와 무관하다.

## 개선 후 목표

| 지표 | 개선 전 (중앙값) | 목표 |
| --- | --- | --- |
| **mousemove당 `Layout`** | **0.986** | **0** |
| mousemove당 React 렌더 | 1.00 | rAF당 1회 이하 |
| Partially Presented Frame | 10 | 0 |
| Dropped Frame | 0 | 0 (유지) |
| mousemove 태스크 중앙값 | 4.69ms | 예산의 25% 이하 (~2ms) |
| 메인 스레드 점유 | 67.1% | 기준선(16.4%)에 근접 |

## 원인

| 파일 | 내용 | 유발 단계 |
| --- | --- | --- |
| `src/pages/Home/components/CustomCursor/CustomCursor.tsx:17-18` | `style.top` / `style.left` 변경 | Layout → Paint → Composite |
| `src/pages/Home/hooks/useMousePosition.tsx` | `mousemove`마다 새 객체로 `setState` → 이벤트 1건당 React 렌더 1회 | — |
