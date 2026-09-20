# S1 (Home 마우스 이동) — 개선 후 측정 지표

> 원본 트레이스: `s1-p1.json` (DevTools enhanced trace, git 제외)
> 측정일: 2026-09-20 / **1회 측정**
> 비교 대상: [`S1-before.metrics.md`](./S1-before.metrics.md) (3회 중앙값)

## 결론 한 줄

**핵심 목표인 "마우스 이동이 Layout/Paint를 일으키지 않는 것"은 달성했다.**
프레임 목표(Dropped 0 / Partially Presented 0)는 **미달**이나, 측정 환경이 개선 전과 달라 그대로 비교할 수 없다.

## 측정 환경 — 개선 전과 다르다 (중요)

| 항목 | 개선 전 | 개선 후 (`s1-p1`) |
| --- | --- | --- |
| 측정 URL | `geongyu09.github.io/perf-basecamp` | `localhost:8080` |
| 빌드 | production (`build:prod`) | **development (`npm run serve`, minify 없음, HMR 켜짐)** |
| 뷰포트 | 806 × 668 (538k px²) | **1728 × 531 (918k px², 1.7배)** |
| 측정 횟수 | 3회 (중앙값) | **1회** |
| CPU 스로틀링 | 6x | 6x (동일) |
| 주사율 | 120Hz (예산 8.33ms) | 120Hz (동일) |
| 확장 프로그램 | 1개 | 1개 (동일) |
| 이동 구간 | 4.50s / mousemove 504 | 5.61s / mousemove 584 |

→ **횟수 기반 지표는 환경과 무관하므로 신뢰할 수 있다.**
→ **시간·프레임 기반 지표는 뷰포트와 빌드 모드 영향을 크게 받는다.**

## 목표 달성 여부

| 지표 | 개선 전 | 목표 | 개선 후 | 판정 |
| --- | --- | --- | --- | --- |
| **mousemove당 `Layout`** | 0.986 | **0** | **0** (트레이스 전체 `Layout` 0회) | ✅ |
| `Paint` | 989회 | — | **0회** | ✅ |
| 입력 처리 중 동기 `Layout` | 495/500 | 0 | **0/0** | ✅ |
| mousemove당 React 렌더 | 1.00 | rAF당 1회 이하 | **0회** (setState 제거) | ✅ |
| mousemove당 앱 JS | 1.139ms | — | **0.747ms** (-34%) | ✅ |
| 메인 스레드 점유 | 67.1% | 기준선(16%) 근접 | 57.2% | ❌ |
| mousemove 태스크 중앙값 | 4.69ms | ~2ms (예산 25%) | 4.91ms | ❌ |
| Partially Presented Frame | 10 | **0** | 19 | ❌ |
| Dropped Frame | 0 | 0 유지 | **47** | ❌ |

## 렌더링 파이프라인이 실제로 끊겼다

개선 전:

```
mousemove → updateMousePosition → setState → React 렌더(R, 0.69ms)
          → style.top/left → Layout → Paint → Composite
```

개선 후:

```
mousemove → updateMousePosition (좌표만 저장)
          → rAF flush → style.transform → Composite
```

- `Layout` **0회**, `Paint` **0회** — 트레이스 전체에서 단 한 번도 없다.
- React 렌더 함수(`R`) 호출 **504회 → 0회**.
- 남은 앱 JS는 `updateMousePosition` 584회(0.29ms/회)와 `flush` 584회(0.11ms/회)뿐이다.
- rAF 합치기는 실제로 1:1로 돈다 (mousemove 584 → `FireAnimationFrame` 583). Chrome이 이미 mousemove를 프레임당 1회로 합쳐 주기 때문이며, 그래도 "프레임당 쓰기 1회 이하" 보장은 유지된다.

## mousemove 1회당 메인 스레드 비용 분해

| 작업 | 개선 전 | 개선 후 | 변화 |
| --- | --- | --- | --- |
| `Layout` | 0.231ms | **0** | 제거 |
| `Paint` | 0.361ms | **0** | 제거 |
| React 렌더 | 0.692ms | **0** | 제거 |
| `Commit` | 0.692ms | 1.013ms | 증가 |
| `Recalculate Style` | 0.520ms | 0.720ms | 증가 |
| 이벤트 디스패치 (mouse+pointer) | 0.721ms | 1.017ms | 증가 |
| `Layerize` | 0.262ms | 0.428ms | 증가 |
| `PrePaint` | 0.575ms | 0.275ms | 감소 |
| `Hit Test` | 0.235ms | 0.236ms | 동일 |

**지우려던 세 가지(Layout / Paint / React 렌더, 합 1.28ms)는 확실히 사라졌다.**
대신 남은 항목이 비슷한 폭으로 늘어 태스크 총 시간이 안 줄었다 (4.69 → 4.91ms).
증가분은 **dev 빌드(minify 없음) + 1.7배 넓은 뷰포트** 영향으로 보인다.
`will-change: transform`으로 커서가 별도 레이어가 된 것도 `Layerize` 증가에 일부 기여한다.

## 미달 분석 1 — Dropped Frame 47개

**커서 때문이 아니라 컴포지터/GPU 쪽이다.**

| 스레드 점유 | 개선 전 | 개선 후 |
| --- | --- | --- |
| CrRendererMain (메인) | 67.1% | 57.2% (↓) |
| **CrGpuMain** | 25.3% | **39.2%** (↑) |
| **VizCompositorThread** | 7.1% | **13.1%** (↑) |
| **RasterTask** | 23.1ms/s | **46.4ms/s (2배)** ↑ |

메인 스레드는 오히려 가벼워졌는데 GPU/래스터만 2배가 됐다.
뷰포트가 1.7배 넓어지면서 **자동 재생 중인 `<video>` 3개**(`FeatureItem`)의 래스터 면적이 커진 결과다.
드롭 프레임은 마우스가 멈춘 구간에도 나타난다 → 커서와 무관하다.

## 미달 분석 2 — `animationiteration` 핸들러 (새로 발견)

프레임 예산(8.33ms)을 넘긴 메인 스레드 태스크 14개 중 상위 2개가 이것이다.

```
RunTask 13.6ms
  └ EventDispatch: animationiteration  8.64ms
      └ React dispatchEvent            7.30ms
RunTask 11.1ms
  └ EventDispatch: animationiteration  4.87ms
      └ React dispatchEvent            4.82ms
```

CSS 애니메이션이 한 바퀴 돌 때마다 React 이벤트 핸들러가 5~7ms를 쓴다.
개선 전 트레이스에서는 같은 이벤트가 0.17ms였다 → **dev 빌드(비압축 React)에서만 크게 부풀려진 값일 가능성이 높다.**
S1 커서 작업과는 별개 항목이다.

## 다음 할 일

1. **개선 전과 동일 조건으로 재측정한다.** — 배포된 production 빌드, 같은 뷰포트(806×668), 3회 측정. 이걸 하기 전에는 프레임/시간 지표의 미달 판정을 확정할 수 없다.
2. 재측정 후에도 Dropped Frame이 남으면 자동 재생 `<video>` 3개를 원인 후보로 따로 검증한다.
3. `animationiteration` 핸들러 비용을 production 빌드에서 다시 확인한다.
4. `App.tsx`의 `Router basename` 주석 처리는 로컬 측정용이므로 **커밋 전 되돌린다.**
