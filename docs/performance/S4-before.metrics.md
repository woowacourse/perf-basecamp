# S4 (Search HelpPanel 열기/닫기) — 개선 전 측정 지표

> 원본 트레이스: `S4-before-run{1,2,3}.json.gz` (git 제외, DevTools에서 `.gz` 그대로 로드 가능)
> 측정일: 2026-09-19
> **3회 모두 6x CPU 스로틀링이 정상 적용됐다.** S1 run1 이후 처음으로 절차 문서 §0 조건을 그대로 만족한 측정이다.

## 결론 먼저

S3와 정반대다. `.selectedItemContainer`에는 `right: -320px` 기본값이 있어서 **트랜지션이 0.5초 내내 정상 동작한다.** 그래서 문제가 더 크다.

패널이 320px를 이동하는 **0.5초 동안 매 프레임 `Layout`과 `Paint`가 돈다.** 전환 1회당 `Layout` 57회, `Paint` 레코드 109개, `Layout Shift` 33건이고, **그 구간 프레임의 96.8%가 Partially Presented Frame이다.**

비용의 정체는 `Layout`이 아니라 `Paint`다. `Layout`은 프레임당 0.32ms인데 `Paint`가 프레임당 4.43ms다. 매 프레임 **문서 전체(3456×3616)** 와 **뷰포트 전체 폭(3456×1262)의 패널 영역**을 다시 칠한다. 패널 자체는 718 device px 폭인데 페인트 영역이 뷰포트 전폭인 것은 `backdrop-filter: blur(5px)` 때문이다.

Dropped Frame은 18회 전환 통틀어 6건으로 사실상 없다. 프레임은 "떨어지는" 게 아니라 **매번 반쪽만 올라간다.**

## 측정 환경

| 항목 | 값 |
| --- | --- |
| 측정 URL | `https://geongyu09.github.io/perf-basecamp` → Home에서 `start search`로 이동 |
| CPU 스로틀링 | **6x (3회 모두 적용).** `metadata.cpuThrottling: 6` |
| Network 스로틀링 | 없음 |
| 디스플레이 | 120Hz (프레임 예산 8.33ms). 전환 518ms 동안 vsync 62회 = 8.35ms 간격으로 실측 확인 |
| DPR | 2 (`metadata.hostDPR`). 아래 표의 device px는 CSS px의 2배다 |
| 뷰포트 | 3456 × 1262 device px (1728 × 631 CSS px) |
| 문서 높이 | 3616 device px (1808 CSS px) |
| 결과 목록 | trending 16개 |
| 측정 횟수 | 3회 × 전환 6회 = **전환 18회** (열기 9 + 닫기 9) |

녹화 구간은 `metadata.modifications.initialBreadcrumb.window` 기준이다.

## 시나리오 수행 결과

절차 문서 §S4가 지시한 "열기/닫기 3회"를 3회 모두 정확히 수행했다. 방향은 트레이스의 `LayoutShift.impacted_nodes` 클래스명으로 판정했다(`showSheet` 클래스가 붙어 있으면 열기 구간).

| 항목 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| 녹화 길이 | 7,851ms | 8,179ms | 10,470ms |
| 전환 횟수 | **6 (열기3 + 닫기3)** | **6 (열기3 + 닫기3)** | **6 (열기3 + 닫기3)** |
| 전환 순서 | 열기→닫기 교대 | 열기→닫기 교대 | 열기→닫기 교대 |
| 클릭 수 | 6 | 7 | 8 |
| 그중 전환을 만들지 않은 클릭 | 0 | 1 | 2 |
| 전환 구간 합계 | 3,108ms | 3,079ms | 3,107ms |
| 정지 구간 합계 | 4,743ms | 5,100ms | 7,364ms |

run2의 1회, run3의 2회는 버튼을 빗맞힌 클릭이다. `EventDispatch(click)`의 `dur`가 0.03~1.49ms이고 내부 `FunctionCall`이 3개뿐이다(정상 클릭은 2.1~6.9ms에 `FunctionCall` 6개). 뒤따르는 `transitionend`가 없으므로 전환 집계에서 제외했다. **전환 18회는 3회 모두 동일하게 확보됐다.**

구간 경계는 `EventDispatch(click)` 시각부터 그 전환의 마지막 `transitionend`까지로 잡았다. `transition: 0.5s all`인데 실제로 바뀌는 속성이 `right`와 `opacity` 둘이라 전환마다 `transitionend`가 정확히 2개씩 나온다.

## 3회 측정 결과 — 전환 1회당

각 run의 값은 그 run의 전환 6회 중앙값, ALL은 전환 18회 전체의 중앙값이다.

| 항목 | run1 | run2 | run3 | **중앙값** |
| --- | --- | --- | --- | --- |
| 전환 길이 (클릭→`transitionend`) | 518.6ms | 513.1ms | 518.0ms | **518.2ms** |
| 구간 내 vsync | 63 | 62 | 62.5 | **62** |
| **`Layout`** | **57.5** | **54.5** | **58** | **57** |
| `Recalculate Style` | 58.5 | 56 | 59.5 | 58 |
| **`Paint` 레코드** | **112** | **102** | **114** | **109** |
| **`Layout Shift`** | **33** | **30.5** | **33.5** | **33** |
| Layout Shift score 합 | 0.0203 | 0.0206 | 0.0198 | **0.0201** |
| `Layout` 소요 합 | 19.2ms | 20.2ms | 17.8ms | **19.8ms** |
| `Recalculate Style` 소요 합 | 19.2ms | 18.5ms | 18.5ms | 18.6ms |
| **`Paint` 소요 합** | **278.2ms** | **267.6ms** | **274.7ms** | **274.6ms** |
| 렌더러 메인 점유 | 89.4% | 88.5% | 83.4% | **86.5%** |
| 정상 프레임 | 56.5 | 53 | 59.5 | 56 |
| **Partially Presented (노랑)** | **61** | **60.5** | **60** | **60** |
| Dropped Frame (빨강) | 1 | 0 | 0 | **0** |
| 클릭→첫 시프트 | 154.6ms | 151.4ms | 151.8ms | 154.1ms |

### 프레임당으로 환산 (중앙값 기준)

| 항목 | 값 | 8.33ms 예산 대비 |
| --- | --- | --- |
| `Layout` | 0.92회 | — |
| `Recalculate Style` | 0.94회 | — |
| `Paint` 레코드 | 1.76개 | — |
| **`Paint` 소요** | **4.43ms** | **53%** |
| `Layout` 소요 | 0.32ms | 4% |
| `Recalculate Style` 소요 | 0.30ms | 4% |
| **메인 스레드 전체 작업** | **7.22ms** | **87%** |
| Layout Shift | 0.53건 | — |
| **Partially Presented** | **0.968** | **프레임의 96.8%** |

### 정지 구간 — 전환 비용을 분리하는 기준

전환과 전환 사이 정지 구간(3회 합계 17.2초, vsync 1,899)의 값이다.

| 항목 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| `Layout` (구간별) | 0,1,1,1,0,1,0 | **6**,0,1,0,0,1,1 | 0,0,1,1,1,1,1 |
| `Paint` (구간별) | 0,2,2,0,0,0,2 | **38**,2,2,2,2,2,0 | 0,0,0,0,0,2,0 |
| `Layout Shift` (구간별) | 0,0,0,0,0,0,0 | **6**,0,0,0,0,0,0 | 0,0,0,0,0,0,0 |
| **Partially Presented 합** | **0** | **5** ※ | **0** |
| Dropped Frame 합 | 2 | 2 | 1 |
| 렌더러 메인 점유 | 7.2~25.4% | 1.2~27.9% | 6.0~24.6% |

※ run2 첫 정지 구간의 `Layout` 6 / `Paint` 38 / `Shift` 6 / partial 5는 **패널이 아니라 결과 카드 호버**다. `impacted_nodes`가 `DIV .gifItem`이고 rect가 x 548 → 2348로 카드 사이를 건너뛴다. 포인터가 그리드를 가로질러 우하단 버튼으로 이동하면서 S3 현상이 섞였다. run1은 카드 시프트 4건, run3은 0건이다. 전부 전환 구간 집계에서 분리했다.

**카드 호버를 뺀 정지 구간은 `Layout`·`Paint`·`Shift`가 사실상 0이고 Partially Presented Frame이 정확히 0이다.**
→ 전환 구간에서 관측된 값은 전부 패널 전환 때문이다. 차감할 기준선이 없다.

## 원인 1 — 트랜지션은 정상 동작한다. 그래서 매 프레임 `Layout`이 돈다

S3와 갈리는 지점이다.

```css
/* HelpPanel.module.css */
.selectedItemContainer {
  position: fixed;
  right: -320px;                                            /* 13행 — 기본값이 있다 */
  opacity: 0;
  backdrop-filter: blur(5px);                               /* 20행 */
  transition: 0.5s all cubic-bezier(0.82, 0.085, 0.395, 0.895); /* 23행 */
}
.selectedItemContainer.showSheet {
  right: 0;                                                 /* 27행 — -320px → 0, 보간 가능 */
  opacity: 1;
}
```

`right`에 기본값 `-320px`가 선언돼 있으므로 `0`과 보간된다. S3의 `top: auto`와 달리 트랜지션이 실제로 돈다.

| | S3 (`GifItem`) | S4 (`HelpPanel`) |
| --- | --- | --- |
| 기본값 | `top` 없음 → `auto` | `right: -320px` |
| 트랜지션 | **동작 안 함** | **동작함 (0.5초)** |
| 상태 변화 1회당 `Layout` | 1회 | **57회** |
| 상태 변화 1회당 Layout Shift | 1건 | **33건** |

실측 근거 세 가지다.

1. 전환마다 `transitionend`가 정확히 2개(`right`, `opacity`) 발생한다. 3회 × 6전환 = 36쌍 전부.
2. 클릭에서 마지막 `transitionend`까지 중앙값 518.2ms다. CSS의 0.5초에 클릭 처리 약 12ms와 프레임 1개가 붙은 값이다.
3. `Layout` 57회가 구간 내 vsync 62회에 거의 1:1로 붙는다(프레임당 0.92).

→ S3의 개선 방향("없던 애니메이션을 만들기")과 달리, S4는 **이미 돌고 있는 애니메이션을 Layout 트리거에서 Composite 트리거로 옮기는 것**이 과제다.

## 원인 2 — 비용의 61%는 `Layout`이 아니라 `Paint`다

전환 1회의 메인 스레드 작업 448ms(518ms × 86.5%)를 쪼갠 값이다.

| 단계 | 소요 | 전환 시간 대비 | 메인 작업 대비 |
| --- | --- | --- | --- |
| **`Paint`** | **274.6ms** | **53.0%** | **61.3%** |
| `Layout` | 19.8ms | 3.8% | 4.4% |
| `Recalculate Style` | 18.6ms | 3.6% | 4.2% |
| 나머지 (Commit / Layerize / 이벤트) | 약 135ms | 26.1% | 30.1% |

`Layout` 1회는 0.054ms로 싸다. 문제는 그 뒤에 따라오는 페인트다. 페인트 대상과 클립은 3회 모두 동일하다.

| 페인트 대상 | 클립 (device px) | 건수 (run1) | 중앙 소요 | 합계 |
| --- | --- | --- | --- | --- |
| `#document` | **3456 × 3616 (문서 전체)** | 330 | 2.77ms | 933.8ms |
| `SECTION .selectedItemContainer.showSheet` | **3456 × 1262 (뷰포트 전폭)** | 169 | 2.26ms | 393.0ms |
| `SECTION .selectedItemContainer` | **3456 × 1262 (뷰포트 전폭)** | 161 | 2.28ms | 364.0ms |

**프레임마다 `#document` 1개 + 패널 1개, 합쳐 약 4.43ms다.** 8.33ms 예산의 53%를 페인트 하나가 먹는다.

### 패널 페인트 영역이 뷰포트 전폭인 이유

패널의 실제 크기는 `width: 320px` = 640 device px이고, `box-shadow: 0 4px 30px`까지 포함한 잉크 영역이 **718 device px**다(`LayoutShift`의 rect로 확인: 완전히 열렸을 때 `[2738, 0, 718, 1262]`, 2738 + 718 = 3456 = 뷰포트 오른쪽 끝).

그런데 `Paint` 클립은 **3456 device px**, 뷰포트 전폭이다. 실제 요소의 **4.8배**다.

S3에서 같은 트레이스 포맷으로 잰 `Paint` 클립은 요소 크기 그대로였다(`DIV .gifItem` 560×560 = 요소 280×280 CSS px). 즉 이 포맷에서 `Paint` 클립은 보통 요소 크기다. 패널만 뷰포트 전폭으로 부푼 원인은 이 요소에만 선언된 `backdrop-filter: blur(5px)`(20행)다. 배경을 다시 샘플링해야 하므로 페인트/무효화 영역이 배경 루트 쪽으로 확장된다.

## 원인 3 — 카드 1개가 아니라 문서 전체가 레이아웃 루트다

`Layout` 이벤트의 인자다. 3회 1,033건 중 1,020건이 아래와 같다.

| 항목 | 값 |
| --- | --- |
| `dirtyObjects` | **1** |
| `totalObjects` | **662** |
| `partialLayout` | **false** |
| `layoutRoots` | **`#document`** (1,033건 전부) |
| `Recalculate Style`의 `elementCount` | **1** (1,117건 중 1,079건) |

나머지 13건(run1 4 / run2 9 / run3 0)은 `dirtyObjects: 7`로, S3에서 확인된 카드 호버의 값과 같다. 포인터가 그리드를 지나며 섞인 분이다.

**패널은 `position: fixed`인데도 레이아웃 루트가 문서 전체다.** 더러워진 요소는 1개인데 662개짜리 트리를 매 프레임 다시 돈다.

S1(`CustomCursor`, `dirtyObjects: 1` / `totalObjects: 71`)·S3(`GifItem`, `1` / `663`)와 같은 형태다. 이 프로젝트에서 `top`/`left`/`right`를 건드리는 세 군데가 전부 같은 결과를 낸다.

## 원인 4 — Layout Shift 33건, 그런데 실제로 밀린 프레임은 57개다

### 기록된 시프트

| 항목 | 값 |
| --- | --- |
| 전환 1회당 시프트 | **33건** (중앙값) |
| `impacted_nodes` | **전부 `SECTION .selectedItemContainer` 자기 자신** |
| `had_recent_input` | **578건 전부 `true`** |
| `frame_max_distance` 최솟값 | **6 device px (3 CSS px)** |
| `frame_max_distance` 중앙값 | 13.25 device px (6.6 CSS px) |
| `frame_max_distance` 최댓값 | 전환별 최댓값의 중앙값 42.5 device px, 18회 전체 최댓값 68 device px |
| `frame_max_distance` 합 | **572.5 device px (286 CSS px)** |
| 전환 1회 score | **0.0201** |
| 열기+닫기 1사이클 score | **0.0403** |
| run 1회(전환 6회) score 합 | 0.1215 / 0.1233 / 0.1203 |

### 시프트 33건은 실제 이동 프레임 57개를 과소 계상한 값이다

기록된 이동량 합계가 **286 CSS px**인데 패널은 **320 CSS px**를 이동한다. 34px이 누락돼 있다. `frame_max_distance` 최솟값이 6 device px = **3 CSS px**이고 그보다 작은 값이 단 한 건도 없다. Blink가 3 CSS px 미만 이동을 시프트로 기록하지 않기 때문이다.

`cubic-bezier(0.82, 0.085, 0.395, 0.895)`를 60프레임(0.5초 × 120Hz)으로 수치 전개하면 실측과 정확히 맞는다.

| | 곡선 계산 | 실측 중앙값 |
| --- | --- | --- |
| 프레임당 이동 3px 이상인 프레임 수 | **33** | **시프트 33건** |
| 그 프레임들의 이동량 합 | **276.5 CSS px (553 device px)** | **fmd 합 572.5 device px** |
| 프레임당 최대 이동 | 17.2 CSS px (34 device px) | fmd 최대 35~42.5 device px |
| 프레임당 이동 3px 미만인 프레임 수 | **27** | **`Layout` 57 − 시프트 33 = 24** |
| 클릭 후 3px를 넘기까지 | 약 150ms (t=155ms에 27.7px 누적) | 클릭→첫 시프트 **154.1ms** |

이 곡선은 시작과 끝이 매우 느리다. 처음 100ms 동안 320px 중 13px만 움직인다. **그 구간에도 `Layout`과 `Paint`는 매 프레임 그대로 돈다.** 화면에서 거의 안 움직이는 프레임에 4.4ms짜리 전체 페인트가 들어간다.

→ **개선 전후 비교의 주 지표는 시프트 건수(33)가 아니라 `Layout` 횟수(57)다.** 시프트는 임계값에 가려 1.7배 적게 잡힌다.

### `had_recent_input: true` — 점수에서는 빠지지만 화면은 밀렸다

578건 전부 `true`다. 클릭(이산 입력)이 500ms 제외 창을 열고, 전환이 그 안(클릭+154ms ~ 클릭+472ms)에 끝나기 때문이다. 녹화 종료 시점의 누적 CLS는 0.0064 / 0.0094 / 0.0094로, 패널 전환은 **CLS 점수에 0을 더한다.**

| | S3 카드 호버 | S4 패널 전환 |
| --- | --- | --- |
| 트리거 입력 | 마우스 이동 (CLS 제외 대상 아님) | **클릭 (제외 대상)** |
| `had_recent_input` | **false** | **true** |
| CLS 점수 가산 | **100% 가산** | **0% 가산** |
| 원시 score (1사이클) | +0.0012 | +0.0403 |

**원시 점수로는 S4가 S3의 33배다.** 제외 규칙에 가려져 있을 뿐이다. 절차 문서 §3이 "점수에서 빠질 뿐 화면은 실제로 밀렸다"고 적어둔 경우가 정확히 이것이고, TODO 4번은 점수가 아니라 현상이 기준이므로 그대로 위반이다.

참고로 이 판정은 아슬아슬하다. 마지막 시프트가 클릭 + 약 472ms에 찍히므로 제외 창 500ms에 28ms 여유밖에 없다. run2 첫 정지 구간의 카드 시프트 6건은 `had_recent_input: false`로 찍혔다.

### 밀린 요소는 패널 자신뿐이다

절차 문서 §S4는 "열릴 때 스크롤바가 생기면 시프트가 잡힌다"를 확인 대상으로 걸어뒀다. **실측 결과 해당 없음이다.** 패널 시프트 578건의 `impacted_nodes`는 전부 `SECTION .selectedItemContainer` 하나뿐이고, 형제 요소나 문서 본문이 밀린 기록은 없다. 패널 내부 스크롤바(`.sheetContentsContainer { overflow-y: scroll }`)는 패널 안에 있어 문서를 밀지 않는다.

## 프레임 1 — 전환 구간 프레임의 96.8%가 Partially Presented다

| 항목 | run1 | run2 | run3 | **합계** |
| --- | --- | --- | --- | --- |
| 전환 구간 vsync | 377 | 370 | 376 | 1,123 |
| **전환 구간 partial** | **359** | **364** | **359** | **1,082** |
| **partial 비율** | **95.2%** | **98.4%** | **95.5%** | **96.4%** |
| 정지 구간 vsync | 508 | 568 | 823 | 1,899 |
| **정지 구간 partial** | **0** | **5** ※ | **0** | **5** |

※ 카드 호버분이다(위 정지 구간 표 주석).

**포인터가 멈춰 있고 패널도 멈춰 있으면 partial이 정확히 0이고, 전환이 시작되면 거의 모든 프레임이 반쪽만 올라간다.** 원인 귀속이 이보다 깔끔할 수 없다.

partial 프레임의 성질도 3회 동일하다.

| 항목 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| `frame_type: FORKED` | 326 | 316 | 337 |
| `frame_type` 없음 | 33 | 53 | 22 |
| 같은 `frame_sequence`에 `STATE_PRESENTED_ALL` 형제가 있음 | 326 | 316 | 337 |

`FORKED`는 컴포지터가 진행 중인 업데이트에 메인 스레드 업데이트가 끼어들어 표면이 갈라진 경우다. S3에서도 같은 값이 나왔지만 성격이 다르다. S3는 GIF 재생이 컴포지터를 돌리는 와중에 호버 레이아웃이 **가끔**(변화당 0.67회) 끼어든 것이고, S4는 메인 스레드가 **매 프레임 7.22ms를 쓰면서 8.33ms 예산 안에 못 들어와** 상시로 갈라진다.

### 근거 — 프레임 예산 초과 태스크

| 항목 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| 전환 구간 8.33ms 초과 태스크 | **128** | **141** | **80** |
| 정지 구간 8.33ms 초과 태스크 | 3 | 3 | 2 |
| 16.7ms 초과 | 2 | 3 | 1 |
| **50ms 초과 (Long Task)** | **0** | **0** | **0** |

Long Task는 한 건도 없다. **단일 긴 작업이 아니라, 프레임마다 예산을 조금씩 넘기는 형태다.** 전환 1회당 8.33ms 초과 태스크가 3~27개씩 쌓인다(run1 13~27, run2 20~27, run3 3~21).

## 프레임 2 — Dropped Frame은 사실상 없다

| 항목 | run1 | run2 | run3 | 합계 |
| --- | --- | --- | --- | --- |
| 전환 구간 dropped | 4 | 0 | 2 | **6 / vsync 1,123 (0.5%)** |
| 정지 구간 dropped | 2 | 2 | 1 | 5 / vsync 1,899 (0.3%) |
| 전환 1회당 중앙값 | 1 | 0 | 0 | **0** |

전환 구간 6건 중 5건이 `frame_type: BACKFILL`이다. 전환 구간과 정지 구간의 비율이 비슷하고 절대량도 미미하다.

→ **TODO 4번의 "Frame Drop이 일어나지 않아야 한다"는 S4에서는 이미 충족 상태다. 위반은 "Partially Presented Frame 역시 최소로 발생해야 한다" 쪽이고, 그 위반이 96.8%다.**

## 스레드 점유

| 스레드 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| **Renderer / CrRendererMain** | **44.2%** | **44.8%** | **35.8%** |
| GPU Process / CrGpuMain | 37.3% | 38.3% | 34.9% |
| Browser / CrBrowserMain | 14.1% | 14.4% | 11.7% |
| GPU Process / VizCompositorThread | 6.5% | 6.5% | 5.7% |
| Renderer / Compositor | 3.0% | 3.0% | 2.7% |

녹화 전체 기준이다(전환 구간만 보면 렌더러 메인 86.5%).

**S3의 스레드 표와 직접 비교하면 안 된다.** S3는 1x, S4는 6x다. CPU 스로틀링은 렌더러 메인에만 걸리고 GPU 프로세스에는 안 걸리므로, S3의 "렌더러 메인 2.2% vs GPU 43~49%"와 S4의 "렌더러 메인 44% vs GPU 37%"는 같은 축에 놓을 수 없다. S4에서 확인되는 사실은 **6x 환경에서 렌더러 메인이 병목**이라는 것뿐이다.

## CSS triggers 분류 — 실측 대조

| 대상 | 변경 속성 | csstriggers 분류 | 실측 |
| --- | --- | --- | --- |
| `HelpPanel.module.css:27` | `right` (`-320px` → `0`) | Layout → Paint → Composite | 프레임당 `Layout` 0.92 + `Paint` 1.76개 + Shift 0.53. **분류대로다** |
| `HelpPanel.module.css:28` | `opacity` (`0` → `1`) | Composite | 단독으로는 비용 없음. `right`와 같은 프레임에 묶여 있을 뿐 |
| `HelpPanel.module.css:20` | `backdrop-filter: blur(5px)` | Paint (영역 확장) | 패널 페인트 클립이 요소 폭 718px이 아니라 **뷰포트 전폭 3456px** |
| `HelpPanel.module.css:23` | `transition: 0.5s all` | — | `transitionend` 2개 = `right` + `opacity`. **의도한 두 속성만 걸렸다** |

`transition: all`은 이번에는 여분의 속성을 붙잡지 않았다. 다만 S3에서 보였듯 대상이 명시돼 있지 않으면 어떤 속성이 트랜지션되는지가 선언에서 드러나지 않는다. 두 파일 모두 명시로 바꾸는 편이 낫다.

## 측정 오염 — 확장 프로그램 두 개가 페이지에 스크립트를 넣고 있다

절차 문서 §0은 시크릿 창을 지시하지만, 시크릿 창에서도 허용된 확장 프로그램은 동작한다. run1의 `FunctionCall` 2,516건 출처다.

| 출처 | 함수 | 호출 수 |
| --- | --- | --- |
| `bundle.js` | `gd` (React 루트 리스너) | 1,976 |
| **`chrome-extension://fjdhph…/content/content.js`** | **`handlePointerMove`** | **340** |
| `bundle.js` | `ed` | 88 |
| `bundle.js` | `fd` | 24 |
| `chrome-extension://fjdhph…/content/content.js` | (익명) | 19 |
| `chrome-extension://fjdhph…/content/content.js` | `handlePointerUp` / `handlePointerDown` | 12 / 6 |
| `chrome-extension://clcdgi…/content/content.js`, `fido2-page-script.js` | `d`, `t` | 13 |

영향은 두 군데다.

1. **강제 동기 레이아웃 6건/run** — `Layout`이 `FunctionCall` 안에 중첩된 경우가 run마다 정확히 6건인데, **6건 전부 `chrome-extension://fjdhph…/content/content.js`** 다. 앱 코드가 만든 강제 동기 레이아웃은 **0건**이다.
2. **히트 테스트가 강제한 레이아웃 / 스타일 재계산** — `WebFrameWidgetImpl::HandleInputEvent` 안에서 도는 경우다. 전환 중에는 레이아웃 트리가 매 프레임 더러우므로 `pointermove`가 들어올 때마다 히트 테스트가 동기 계산을 강제한다. run1은 전환 중 마우스가 많이 움직여 `Layout` 27건 + `Recalculate Style` 48건, run2·run3은 `Layout` 0건 + `Recalculate Style` 22건씩이다. 확장 프로그램의 `handlePointerMove`(340회)가 여기에 얹혀 있다.
3. 프레임 집계에는 영향 없다. 확장 프로그램 레이어 트리(`layer_tree_host_id: 33`)는 페이지 레이어 트리(`1`)와 분리돼 있어 처음부터 제외하고 셌다.

### 다시 측정할 때 확인할 것

- 시크릿 창에서 **확장 프로그램 허용을 모두 끈다.** 켜져 있으면 강제 동기 레이아웃 판정이 앱 코드 것인지 확장 것인지 매번 구분해야 한다.
- 절차 문서 §S4의 "버튼으로 이동하면서 클릭하지 말 것"을 지킨다. run1은 전환 중 `pointermove`가 340회 들어와 히트 테스트 레이아웃 27건이 섞였고, run2는 포인터가 결과 그리드를 가로지르며 카드 시프트 6건을 만들었다.
- 우하단 버튼을 빗맞힌 클릭이 run2에 1회, run3에 2회 있었다. 클릭 전에 포인터를 멈추고 버튼 중앙을 누른다.

## 비교 지표 선택

전환 길이가 504~533ms로 3회 모두 거의 같고(CSS가 0.5초로 고정하므로 사용자 조작 속도의 영향을 받지 않는다), 전환 횟수도 18회로 동일하다. 따라서 **절대 개수를 그대로 써도 된다.** S3처럼 조작 횟수로 정규화할 필요가 없다.

3회의 산포가 작은 지표를 주 지표로 쓴다.

| 지표 | run1 | run2 | run3 | 산포 |
| --- | --- | --- | --- | --- |
| **전환 1회당 `Layout`** | 57.5 | 54.5 | 58 | ±3% |
| **전환 1회당 `Paint` 소요** | 278.2ms | 267.6ms | 274.7ms | ±2% |
| **전환 구간 partial 비율** | 95.2% | 98.4% | 95.5% | ±2% |
| 전환 1회당 Layout Shift | 33 | 30.5 | 33.5 | ±5% |
| 전환 1회당 score | 0.0203 | 0.0206 | 0.0198 | ±2% |

→ 주 지표는 **전환 1회당 `Layout` 횟수**, **전환 1회당 `Paint` 소요**, **전환 구간 Partially Presented 비율** 셋이다.

## 개선 후 목표

| 지표 | 개선 전 (중앙값) | 목표 | 근거 |
| --- | --- | --- | --- |
| **전환 1회당 `Layout`** | **57** | **0** | `transform`은 Layout을 유발하지 않는다 |
| 전환 1회당 `Recalculate Style` | 58 | 1 (클래스 토글 1회) | 보간은 컴포지터가 한다 |
| **전환 1회당 `Paint` 레코드** | **109** | **0** | 레이어 이동만 남는다 |
| **전환 1회당 `Paint` 소요** | **274.6ms** | **0** | 위와 같음 |
| **전환 1회당 Layout Shift** | **33** | **0** | transform 단독 이동은 시프트로 기록되지 않는다 |
| 전환 1회당 원시 score | 0.0201 | **0** | 현재는 `had_recent_input`에 가려 CLS에 0으로 들어간다 |
| **전환 구간 partial 비율** | **96.8%** | **10% 미만** | TODO 4번 |
| 프레임당 메인 작업 | 7.22ms | 1ms 미만 | 예산 8.33ms |
| 전환 구간 메인 점유 | 86.5% | 15% 미만 | 위와 같음 |
| 전환 구간 Dropped Frame | 0 | 0 (유지) | 현재도 충족 |
| Long Task | 0 | 0 (유지) | 현재도 충족 |
| 앱 코드발 강제 동기 레이아웃 | 0 | 0 (유지) | 현재도 충족 |

### 개선 방향

1. **`right` → `transform: translateX()`.** `.selectedItemContainer`에서 `right: -320px`를 `right: 0; transform: translateX(100%)`로, `.showSheet`에서 `right: 0`을 `transform: translateX(0)`로 바꾼다. `Layout` 57회와 `Paint` 109개가 통째로 사라진다. S3의 `top` → `translateY`와 같은 변경이다.
2. **`transition: all`을 명시로.** `transition: transform 0.5s …, opacity 0.5s …`. 바뀌는 속성이 선언에 드러난다.
3. **`backdrop-filter: blur(5px)`는 그대로 두고 재측정한다.** 1번을 적용하면 페인트가 컴포지터로 넘어가므로 메인 스레드 비용은 사라지지만, 배경 블러 재샘플링은 매 프레임 GPU에서 계속 돈다. partial이 목표치까지 안 떨어지면 그때 이 속성을 떼거나 `will-change: transform`으로 레이어를 미리 올리는 것을 검토한다. **1번과 3번을 한 번에 바꾸면 어느 쪽 효과인지 분리할 수 없다.**

## 원인 정리

| 파일 | 내용 | 결과 |
| --- | --- | --- |
| `src/pages/Search/components/HelpPanel/HelpPanel.module.css:13,27` | `right: -320px` → `right: 0` 보간 | 전환 1회당 `Layout` 57회 + `Paint` 109개 + Layout Shift 33건 |
| `src/pages/Search/components/HelpPanel/HelpPanel.module.css:20` | `backdrop-filter: blur(5px)` | 패널 페인트 클립이 요소 폭 718px이 아니라 뷰포트 전폭 3456px. 프레임당 페인트 4.43ms |
| `src/pages/Search/components/HelpPanel/HelpPanel.module.css:23` | `transition: 0.5s all` | 대상 속성이 선언에 드러나지 않음(실제로는 `right`, `opacity` 2개) |
| (구조) | `layoutRoots: #document`, `totalObjects: 662`, `partialLayout: false` | `position: fixed` 요소 1개가 더러워져도 662개 트리를 전부 다시 돈다 |

## 해당 없음 — 리포트 S4 행에 쓰지 말 것

| 항목 | 결과 |
| --- | --- |
| Long Task (>50ms) | **3회 모두 0건.** 녹화 시작부 160~174ms 태스크는 DevTools 자신의 `ScriptCatchup`(소스 런다운)이라 앱 비용에서 제외했다 |
| Dropped Frame | **18회 전환 통틀어 6건(0.5%).** 그중 5건이 `BACKFILL`. 정지 구간(0.3%)과 차이가 없다 |
| 앱 코드발 강제 동기 레이아웃 | **0건.** 관측된 6건/run은 전부 확장 프로그램 `content.js` |
| 스크롤바 발생으로 인한 시프트 | **없음.** 시프트 578건의 `impacted_nodes`가 전부 패널 자신뿐 |
| CLS 점수 상승 | **0.** `had_recent_input`이 578건 전부 `true`라 점수에서 제외된다. 원시 score 0.0403/사이클은 별도로 기록한다 |
| S3와의 스레드 점유 비교 | **불가.** S3는 1x, S4는 6x. CPU 스로틀링은 렌더러 메인에만 걸린다 |
| `transition: all`이 여분 속성을 잡는 문제 | **이 파일에서는 해당 없음.** `transitionend` 2개 = 의도한 `right` + `opacity` |

## 측정 방법 메모

- **프레임 판정**: `PipelineReporter` 이벤트의 `args.frame_reporter.state`를 썼다 (`STATE_DROPPED` / `STATE_PRESENTED_PARTIAL` / `STATE_PRESENTED_ALL` / `STATE_NO_UPDATE_DESIRED`). 페이지 레이어 트리만 세고(렌더러 pid의 `SetLayerTreeId`로 확인, 이번에는 `1`) 확장 프로그램 레이어 트리(`33`)는 제외했다. 한 vsync에 `PipelineReporter`가 2건 나오는 경우(`FORKED`)가 있어 프레임 수는 `frame_sequence`의 고유 개수로 셌다.
- **구간 경계**: 전환 = `EventDispatch(click)` ~ 그 전환의 마지막 `transitionend`. 정지 = 전환과 전환 사이. `transitionend`가 전환당 정확히 2개씩 나오므로 경계가 모호하지 않다.
- **전환 방향 판정**: `LayoutShift.impacted_nodes[].debug_name`의 클래스명. `showSheet` 해시 클래스가 붙어 있으면 열기, 없으면 닫기다.
- **카드 호버 분리**: `impacted_nodes`가 `.gifItem` 계열이면 카드, `.selectedItemContainer`면 패널로 나눠 집계했다. 3회 합쳐 카드 12건 / 패널 578건이다.
- **메인 스레드 점유**: 렌더러 메인 스레드의 최상위 `RunTask` 합계 / 구간 길이.
- **이징 곡선 대조**: `cubic-bezier(0.82, 0.085, 0.395, 0.895)`를 이분법으로 수치 전개해 60프레임의 프레임당 이동량을 계산하고 실측 `frame_max_distance` 분포와 맞춰봤다. 3px 미만 프레임 27개 / 3px 이상 33개가 실측(`Layout` 57 − 시프트 33 = 24 / 시프트 33)과 일치한다.
