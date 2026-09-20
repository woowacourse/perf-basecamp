# S5 (Search load more) — 개선 후 측정 지표

> 원본 트레이스: `S5-after-run1.json.gz` (DevTools enhanced trace, git 제외)
> 측정일: 2026-09-20 11:09 UTC / **1회 측정**, CPU 6x
> 비교 대상: [`S5-before.metrics.md`](./S5-before.metrics.md) (6x, 3회 중앙값)

## 무엇을 고쳤나

| 파일 | 조치 |
| --- | --- |
| `GifItem.tsx` | `export default memo(GifItem)` |
| `SearchResult.module.css` | `.loadMoreButton`의 `transition: all 0.5s` → `transition: opacity 0.2s`, `:hover`는 `background` 재선언 대신 `opacity: 0.85` |

TODO 4-2(버튼·푸터가 뷰포트 밖으로 밀리는 시프트)는 손대지 않았고, `GifItem.module.css`의 호버는 S3에서 이미 `top` → `transform`으로 바뀐 상태로 측정됐다.

## 측정 환경 — 개선 전과 축이 다르다

| 항목 | 개선 전 | 개선 후 |
| --- | --- | --- |
| URL / 빌드 | `geongyu09.github.io` / production | **`localhost:8080` / development, `minimize: false`** |
| 측정 횟수 | 3회 중앙값 | **1회** |
| 뷰포트 | 864 × 631 CSS px | **864 × 463 CSS px** |
| 새 이미지 | 16장 전부 네트워크 / 52.67MB | **3장만 네트워크(3.65MB), 13장 메모리 캐시** |
| API 대기 | 17.9~210.9ms | 46.4ms |

번들이 minify되지 않은 development 빌드라 JS 시간은 그대로 비교할 수 없고, 뷰포트 높이가 168 CSS px 낮아 시프트 score의 분모도 달라졌다. 시간 지표는 참고값으로 읽고, 건수·요소 수 지표만 개선 전과 같은 축에서 읽으면 된다.

## 목표 달성 여부

| 지표 | 개선 전 (6x 중앙값) | 목표 | **개선 후** | 판정 |
| --- | --- | --- | --- | --- |
| `Recalculate Style`의 `elementCount` | 80 | **80 유지** | **80** | ✅ |
| `Layout`의 `dirtyObjects` | 102 / 756 | 유지 | **102 / 756** | ✅ |
| `had_recent_input: false` 시프트 | +0.00205 / 회 | **0** | **0** (트레이스 전체 시프트 1건) | ✅ |
| **Layout Shift score (load more)** | 0.278922 | **0** | **0.380130** | ❌ |
| **밀림 거리** | 2400 CSS px | **0** | **2400 CSS px** (4800 device px) | ❌ |
| **메인 블로킹 (API 완료 → 커밋 종료)** | 32.67ms | < 16.7ms | **36.64ms** | ❌ (빌드 차이 있음) |
| └ ① React 렌더 태스크 | 18.91ms | 단축 | 23.25ms | ❌ |
| └ ② 스타일+레이아웃+페인트+커밋 | 16.37ms | — | **13.39ms** | 🔶 |
| 커밋 구간 Dropped | 2 / 4 (50%) | 0 | **4 / 5 (80%)** | ❌ |
| 앱 코드 Long Task (>50ms) | 0 | 0 유지 | **0** | ✅ |
| 강제 동기 레이아웃 | 0 | 0 유지 | **0** | ✅ |

## 확인된 개선 — 재마운트 없음, 파생 시프트 소멸

`Recalculate Style`의 `elementCount`가 80, `Layout`의 `dirtyObjects`가 102 / 756으로 개선 전과 바이트 단위로 같다. `memo`를 붙이면서 기존 16장이 언마운트·재마운트돼 160으로 늘어날 위험이 있었는데, 그 회귀는 일어나지 않았다.

시프트는 트레이스 전체에 **1건**뿐이고 `had_recent_input`이 `true`다. 개선 전에는 버튼이 밀려난 자리로 포인터 밑에 카드가 들어와 호버가 걸리고 이탈할 때 `had_recent_input: false` 시프트가 CLS에 가산됐는데(+0.00205), 호버가 `transform`으로 바뀌면서 그 파생분이 사라졌다. 실제로 이번 트레이스에서도 커밋 직후 `pointerout` / `mouseover`가 같은 자리에서 발생했지만(3751~3752ms) 시프트로 이어지지 않았다.

## 남은 문제 — 버튼은 여전히 2400px 아래로 사라진다

| 밀린 요소 | `old_rect` (device px) | `new_rect` |
| --- | --- | --- |
| `BUTTON .loadMoreButton` (node 7396) | `[0, 494, 1728, 112]` | `[0, 0, 0, 0]` |
| `FOOTER` (node 7097) | `[0, 686, 1728, 240]` | `[0, 0, 0, 0]` |

`EventTiming`의 클릭 `nodeId`가 7396으로 밀려난 버튼과 같아, 방금 누른 버튼이 화면 밖으로 나가는 현상이 그대로다. score가 0.2789에서 0.3801로 오른 것은 악화가 아니라 뷰포트 높이가 631 → 463 CSS px로 줄어 같은 면적의 분모가 작아진 결과이며, `frame_max_distance` 4800 device px는 개선 전과 동일하다. TODO 4-2는 미착수 상태다.

## 메인 블로킹은 판정을 유보한다

커밋 구간 36.1ms 동안 메인 점유는 100%이고, 태스크는 React 렌더 23.25ms와 스타일·레이아웃·페인트 13.39ms 두 개다. 뒤쪽 13.39ms는 개선 전 16.37ms보다 줄었지만(`Recalculate Style` 2.43 + `Layout` 1.42 + `PrePaint` 0.15 + `Paint` 2.06 + `Commit` 0.09, 나머지는 호버 `HitTest` 1.11과 이벤트 디스패치), 앞쪽 React 렌더 태스크는 18.91ms에서 23.25ms로 늘었다.

`memo`가 붙었는데 렌더 태스크가 길어진 이유를 트레이스로는 가를 수 없다. 이번 측정이 minify하지 않은 development 번들이라 같은 양의 JS라도 시간이 길게 나오고, Performance 탭은 "32개 중 몇 개가 렌더됐는가"를 알려주지 않기 때문이다. **`memo` 효과 판정은 production 빌드 재측정과 [React Profiler](../measure-react-profiler.md) 측정 뒤로 미룬다.**

## 이미지 구간 (커밋 종료 ~ +1초) — 비교 불가

| 항목 | 개선 전 (네트워크 회차) | 개선 전 (캐시 회차) | 개선 후 |
| --- | --- | --- | --- |
| Dropped | 23.5% / 18.1% | 1.3% | **10.5% (10 / 95)** |
| Partially Presented | 3 / 13 | 0 | **16** |
| 메인 점유 | 47.0% / 40.0% | 6.9% | **66.4%** |
| `ResourceReceivedData` | 478 / 626 | 0 | **1,997** |

16장 중 13장이 메모리 캐시에서 와 네트워크 부하가 개선 전의 1/14인데도 메인 점유가 더 높다. `images.original.url`은 그대로라 전송량 자체는 줄지 않았고, 이 구간은 원래 TODO 1번 범위이므로 S5 판정에 쓰지 않는다.

## 해당 없음

| 항목 | 결과 |
| --- | --- |
| 앱 코드 Long Task (>50ms) | **0건.** 618.7ms의 450.5ms 태스크는 내부가 `ScriptCatchup` 32건인 DevTools 자신의 비용이다 |
| 강제 동기 레이아웃 / 스타일 재계산 | **0건.** `Layout`·`UpdateLayoutTree` 전건에 `stackTrace` 없음 |
| 클릭 → 첫 프레젠트 | 32.0ms. 개선 전과 마찬가지로 네트워크 대기가 섞여 비교 지표로 쓰지 않는다 |

## 다음 조치

1. **TODO 4-2를 착수한다.** `load more` 버튼을 목록 위로 올리거나 추가분을 붙인 뒤 버튼 위치를 스크롤로 보정해야 2400px 밀림이 0이 된다.
2. **production 빌드 + 뷰포트 864 × 631로 재측정한다.** 메인 블로킹 목표(< 16.7ms) 판정은 그때 내린다.
3. **React Profiler로 기존 16장이 실제로 렌더를 건너뛰는지 확인한다.** DOM 지표는 개선 전과 같으므로 `memo` 효과는 JS 시간 안에만 있다.
4. 이미지 구간을 재측정할 때는 매 회차 `Disable cache`를 켜 캐시 상태를 고정한다.
