# S5 (Search load more) — 개선 전 측정 지표

> 원본 트레이스: `S5-before-run{1,2,3}.json.gz` (git 제외, DevTools에서 `.gz` 그대로 로드 가능)
> 측정일: 2026-09-19 08:42~08:43 UTC / 3회 측정 후 중앙값 / CPU **6x** 스로틀링
> 내려받은 파일명은 `s5-1~3`이었으나 절차 문서 §S4(HelpPanel)가 아니라 **§S5(load more)** 시나리오다. 트레이스에 `click` 1회 → `api.giphy.com/v1/gifs/search?offset=16&limit=16` 1건 → 미디어 16건이 찍혀 있어 S5로 확정했다. **S4는 아직 미측정이다.**

## 결론 먼저

`load more` 한 번의 비용은 **서로 성질이 다른 세 덩어리**이고, 절차 문서가 지시한 "응답 직후 1초"를 한 구간으로 집계하면 셋이 뭉개진다.

| 덩어리 | 중앙값 | 성질 | TODO |
| --- | --- | --- | --- |
| ① React 렌더 + 커밋 | **32.7ms 메인 스레드 100% 점유** | 캐시 여부와 무관. 3회 모두 재현 | 4-1 |
| ② Layout Shift | **score 0.2789 / 2400 CSS px** | 3회 **완전히 동일한 값** | 4-2 |
| ③ 새 이미지 52.67MB 수신·디코드 | **이후 1초간 드롭 18~24%** | 캐시 히트 회차는 **1.3%** | **1번(이미지 크기)** |

- ①에서 **스타일 재계산 대상은 정확히 80개(신규 16장 × 5요소)다.** 기존 16장은 리렌더돼도 DOM이 바뀌지 않아 스타일·레이아웃에 나타나지 않는다. 즉 기존 16장의 리렌더 비용은 **전부 JS 시간 안에만** 있고, 그 분해는 [React Profiler](../measure-react-profiler.md)로 따로 재야 한다.
- ②는 **내가 방금 누른 `load more` 버튼과 푸터가 뷰포트 밖으로 완전히 밀려나는** 시프트다. `had_recent_input: true`라 CLS 점수에서는 빠지지만, TODO 4번은 점수가 아니라 현상이 기준이다.
- ②가 **파생 시프트를 하나 더 만든다.** 버튼이 밀려난 자리에 멈춰 있던 포인터 밑으로 카드가 들어와 호버가 걸리고, 나중에 호버가 풀릴 때의 시프트는 `had_recent_input: **false**` → **CLS에 그대로 가산된다(+0.00205).**
- ③은 S5가 아니라 TODO 1번 대상이다. 같은 시나리오인데 이미지가 메모리 캐시에서 온 run2만 드롭 1.3%다.
- **앱 코드 Long Task(>50ms)는 3회 모두 0건, 강제 동기 레이아웃도 0건이다.** S5의 문제는 "긴 태스크 하나"가 아니라 "30~45ms짜리 블로킹 + 거대한 시프트 + 52MB 다운로드"다.

## 측정 환경

| 항목 | 값 |
| --- | --- |
| 측정 URL | `https://geongyu09.github.io/perf-basecamp` → Home에서 `start search`로 이동 |
| CPU 스로틀링 | **6x slowdown** (3회 모두 `cpuThrottling: 6` 확인) |
| Network 스로틀링 | 없음 |
| 뷰포트 | **864 × 631 CSS px** (DPR 2 → 1728 × 1262 device px) |
| 디스플레이 | 120Hz (프레임 예산 8.33ms) |
| 검색어 | `Haerin` (`offset=16`, `limit=16`) |
| 스크롤 위치 | y = 2473 CSS px = **문서 맨 아래**. 절차 문서대로 `load more`가 보이는 상태 |
| 측정 횟수 | 3회 (08:42:13 / 08:42:52 / 08:43:12 UTC, 연속) |

### ⚠ S3과 창 너비가 다르다 — 그대로 비교하면 안 된다

| | S3 측정 | **S5 측정(이번)** |
| --- | --- | --- |
| 문서 너비 | 2952 device px (**1476 CSS px**) | 1728 device px (**864 CSS px**) |
| 그리드 1행 | **4개** (`280×4 + 20×3 = 1180`) | **2개** (`280×3 + 20×2 = 880 > 864`) |

`.searchResultSection`의 `max-width: 1180px`는 이번 창에서 아무 역할도 하지 않는다. **16개 추가 = 8행 × 300px = 2400 CSS px**가 밀려나는데, S3 때의 창 너비였다면 4행 = 1200px이었을 것이다. 개선 후 측정은 **같은 창 너비**로 해야 시프트 크기가 비교된다.

## 시나리오 수행 결과

| 항목 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| 녹화 길이 | 4,665ms | 3,538ms | 3,164ms |
| `load more` 클릭 시각 | 974ms | 1,252ms | 1,136ms |
| 클릭 횟수 | 1 | 1 | 1 |
| GIPHY API 대기 | **210.9ms** | 32.3ms | 17.9ms |
| 미디어 요청 | 16건 / 52.67MB | **0건 (전부 메모리 캐시)** | 16건 / 52.67MB |
| 마지막 `load` 이벤트 | 클릭 + 766ms | 클릭 + 89ms | 클릭 + 485ms |

**run2는 절차 위반이 아니라 유용한 대조군이다.** run1이 받아 둔 GIF 16개가 메모리 캐시에 그대로 남아 네트워크 요청이 0건이 됐다. 덕분에 **"React 커밋 비용"과 "이미지 다운로드 비용"을 실측으로 분리할 수 있다.** 둘을 가르는 근거로 아래에서 계속 쓴다.

run1의 API 대기 210.9ms는 이 회차만 콜드였기 때문이다. **네트워크 대기는 전후 비교 지표에서 뺀다**(절차 문서 §S5의 지시와 같다).

## 3회 측정 결과

### 구간 정의 — 절차 문서보다 한 단계 더 쪼갰다

절차 문서는 "GIPHY 응답 직후부터 1초"를 한 구간으로 잡고 그 안의 지표를 집계하라고 지시한다. 그 구간에는 **30~45ms짜리 커밋**과 **나머지 950ms의 이미지 수신**이 같이 들어가는데, 둘은 원인도 담당 TODO도 다르다. 그래서 아래처럼 구간을 나눠 각각 집계했다. 마지막 행이 절차 문서가 지시한 구간이며, 대조용으로 같이 싣는다.

| 구간 | 시작 | 끝 |
| --- | --- | --- |
| 기준선 | 녹화 시작 | 클릭 |
| 네트워크 대기 | 클릭 | API `ResourceFinish` |
| **커밋 구간** | API `ResourceFinish` | `Commit` 종료 |
| **이미지 구간** | `Commit` 종료 | +1초 |
| (절차 문서 구간) | API `ResourceFinish` | +1초 |

### 커밋 구간 — 메인 스레드가 통째로 막힌다

| 항목 | run1 | run2 | run3 | **중앙값** |
| --- | --- | --- | --- | --- |
| **① React 렌더 태스크** | 15.17ms | **22.54ms** | 18.91ms | **18.91ms** |
| **② 스타일+레이아웃+페인트+커밋 태스크** | 16.37ms | 19.91ms | 9.66ms | **16.37ms** |
| └ `Recalculate Style` | 2.02ms | 1.10ms | 1.00ms | 1.10ms |
| └ **`elementCount`** | **80** | **80** | **80** | **80** |
| └ `Layout` | 2.80ms | 7.29ms | 3.02ms | 3.02ms |
| └ **`dirtyObjects` / `totalObjects`** | **102 / 756** | **102 / 756** | **102 / 756** | 3회 동일 |
| └ `PrePaint` | 1.03ms | 1.15ms | 1.47ms | 1.15ms |
| └ `Paint` 레코드 | **1** (`#document`) | **1** | **1** | **1** |
| └ `Commit` | 4.31ms | 1.25ms | 0.13ms | 1.25ms |
| **①+② 합 (메인 블로킹)** | **32.67ms** | **44.47ms** | **28.64ms** | **32.67ms** |
| **구간 메인 점유** | **100.0%** | **98.5%** | **100.0%** | **100%** |
| 구간 내 프레임 | 4 | 6 | 4 | 4 |
| **그중 Dropped** | **2 (50%)** | **5 (83%)** | **2 (50%)** | **50%** |
| Partially Presented | 0 | 0 | 0 | 0 |
| 프레임 예산(8.33ms) 대비 | **392%** | **534%** | **344%** | **392%** |

**이미지를 한 장도 받지 않은 run2가 가장 비싸다(44.47ms).** 커밋 비용은 네트워크·캐시와 무관하다는 뜻이고, 이 값이 S5의 주 지표다.

### 이미지 구간 (커밋 종료 ~ +1초) — 캐시 여부로 갈린다

| 항목 | run1 (네트워크) | run2 (**캐시**) | run3 (네트워크) |
| --- | --- | --- | --- |
| 구간 메인 점유 | 47.0% | **6.9%** | 40.0% |
| 프레임 수 | 98 | 75 | 94 |
| **Dropped** | **23 (23.5%)** | **1 (1.3%)** | **17 (18.1%)** |
| **Partially Presented** | **3** | **0** | **13** |
| `RunTask` 개수 | 4,212 | **187** | 3,187 |
| `ResourceReceivedData` | 478 | **0** | 626 |
| `Paint` | 227 | **1** | 191 |
| `Decode Image` | 72건 / 46ms | 84건 / 69ms | 96건 / 48ms |
| GC sweep 태스크 | 2,321건 / 16.9ms | **0건** | 24건 / 4.8ms |

**같은 코드, 같은 상호작용인데 드롭률이 23.5% vs 1.3%다.** 차이는 52.67MB를 받느냐뿐이다.
`RunTask`가 1초에 4,212개까지 치솟는 것도 다운로드 때문이다. 청크가 도착할 때마다 메인 스레드에 `ResourceReceivedData` 태스크가 생기고(478/626건), 버려지는 청크 객체가 GC sweep 태스크 2,321건을 만든다. 개별 태스크는 중앙값 0.001ms로 짧지만 합치면 메인 점유의 절반이다.

### 기준선 / 절차 문서 구간

| 항목 | run1 | run2 | run3 |
| --- | --- | --- | --- |
| **기준선** (녹화 시작~클릭) | | | |
| 길이 | 974ms | 1,252ms | 1,136ms |
| 메인 점유 | 33.2% ※ | 24.8% ※ | 25.6% ※ |
| Dropped | 3 (6.0%) | 1 (1.6%) | **0 (0%)** |
| Partially Presented | **0** | **0** | **0** |
| `Layout` / Shift | **0 / 0** | **0 / 0** | **0 / 0** |
| **절차 문서 구간** (API 완료~+1초) | | | |
| Dropped | 25 (25.0%) | 5 (6.7%) | 19 (19.8%) |
| Partially Presented | 3 | 0 | 13 |
| 메인 점유 | 50.3% | 9.8% | 42.8% |

※ 기준선 메인 점유에는 **녹화 시작 지점의 DevTools `ScriptCatchup`(소스 런다운) 태스크 184.9 / 170.3 / 176.3ms가 포함돼 있다.** 앱 비용이 아니다. 빼면 14~20%p 낮아진다. S3에서와 같은 현상이다.

기준선에서 `Layout`과 Layout Shift가 3회 모두 0이다. **커밋 구간에서 관측된 `Layout`·시프트는 전부 `load more` 때문이다.** 차감할 것이 없다.

### 스레드별 점유 (절차 문서 구간 1초)

| 스레드 | run1 | run2 (캐시) | run3 |
| --- | --- | --- | --- |
| **Renderer / CrRendererMain** | **50.3%** | **9.8%** | **42.8%** |
| **GPU Process / CrGpuMain** | 16.0% | **26.6%** | 31.1% |
| Browser / CrBrowserMain | 10.0% | 9.1% | 12.7% |
| GPU Process / VizCompositorThread | 3.9% | 4.2% | 4.1% |

run2는 렌더러 메인이 9.8%로 거의 놀고 있는데 **GPU 프로세스는 26.6%다.** GIF 32장 동시 재생 부하는 캐시와 무관하게 남는다(S3에서 확인한 것과 같은 항목). 다만 S3 때의 44%보다 낮은데, 이번 창이 좁아 뷰포트에 보이는 카드 수가 적기 때문이다.

## 원인 1 — 추가 로드가 목록 전체를 다시 렌더한다 (TODO 4-1)

```tsx
// useGifSearch.tsx:65
setGifList((prevGifList) => [...prevGifList, ...newGitList]);
```

```tsx
// SearchResult.tsx:17-23
const renderGifList = () => (
  <div className={styles.gifResultWrapper}>
    {gifList.map((gif) => (
      <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
    ))}
  </div>
);
```

`gifList`가 새 배열이 되면 `SearchResult`가 리렌더되고, `GifItem`에 `React.memo`가 없으므로 **기존 16개를 포함한 32개 전부가 다시 호출된다.**

### 트레이스가 말해 주는 것과 말해 주지 못하는 것

React 렌더 태스크의 최상위 프레임은 `bundle.js:1895:64` 하나다. 트레이스에 포함된 소스맵으로 풀면 **`node_modules/scheduler/cjs/scheduler.production.min.js`** — React 스케줄러의 워크 루프다. 즉 15~22ms 전체가 React 렌더·커밋이고, 그 사이에 앱 코드 프레임이 따로 잡히지 않는다.

**Performance 탭으로는 "32개 중 몇 개가 렌더됐는가"를 알 수 없다.** 다만 DOM 변경 범위는 확정된다.

| 지표 | 값 | 의미 |
| --- | --- | --- |
| `Recalculate Style`의 `elementCount` | **80** | `GifItem` 1장 = `div` + `img` + `div` + `div` + `h4` = **5요소**. 80 = **16장 × 5** |
| 160이었다면 | — | 32장 전부의 DOM이 교체됐다는 뜻 |
| `Layout`의 `dirtyObjects` | 102 | 신규 80 + 래퍼·버튼·푸터 등 22 |

→ **기존 16장은 리렌더되지만 DOM diff 결과가 같아 스타일·레이아웃·페인트에는 나타나지 않는다.** 낭비는 전부 **JS 시간(VDOM 생성 + diff)** 안에 있고, 그것이 15~22ms 중 얼마인지는 이 트레이스로 못 자른다. → [measure-react-profiler.md](../measure-react-profiler.md)로 "기존 16개도 렌더되는가 / 렌더 시간은 얼마인가"를 재야 S5 결론이 닫힌다.

개선 방향은 `GifItem`에 `React.memo`를 씌우는 것이다. `key`가 이미 `gif.id`이고 `imageUrl`·`title`이 원시값이라 얕은 비교로 충분하다.

## 원인 2 — 방금 누른 버튼이 뷰포트 밖으로 사라진다 (TODO 4-2)

**3회 모두 완전히 동일한 값이다.**

| 항목 | 값 (run1 = run2 = run3) |
| --- | --- |
| `score` | **0.2789223454833598** |
| `frame_max_distance` | **4800 device px = 2400 CSS px** |
| `had_recent_input` | `true` |
| `impacted_nodes` | **2개** |

| 밀린 요소 | `old_rect` (device px) | `new_rect` |
| --- | --- | --- |
| `FOOTER` (node 73) | `[0, 1022, 1728, 240]` | **`[0, 0, 0, 0]`** |
| `BUTTON .loadMoreButton` (node 820 / 1203 / 1394) | `[0, 830, 1728, 112]` | **`[0, 0, 0, 0]`** |

`new_rect`가 `[0,0,0,0]`은 **뷰포트 밖으로 완전히 나갔다**는 뜻이다. 버튼 높이 112 device px = 56 CSS px = `3.5rem`으로 `SearchResult.module.css:17`의 `height: 3.5rem`과 정확히 일치한다.
`EventTiming`의 클릭 `nodeId`(820 / 1203 / 1394)가 밀려난 `BUTTON`의 `node_id`와 같다. **사용자가 방금 누른 그 버튼이다.**

### score가 왜 0.2789인지 — 숫자가 딱 떨어진다

```
impact fraction = (버튼 1728×112 + 푸터 1728×240) / 뷰포트 1728×1262
                = 608,256 / 2,180,736
                = 0.27892234548335976        ← 실측 score와 소수점 15자리까지 일치
distance fraction = 4800 / 1728 = 2.78 → 1.0으로 포화
```

**즉 score는 순수하게 "뷰포트의 27.9%를 차지하던 두 요소가 통째로 밀려났다"는 값이다.** 이동 거리는 이미 상한을 아득히 넘었다.

### 2400px은 어디서 나오나

| 항목 | 값 |
| --- | --- |
| 1행 카드 수 | **2개** (컨테이너 864 CSS px, 카드 280 + gap 20) |
| 추가 16개 | **8행** |
| 행 높이 | 280 + 20 = 300 CSS px |
| 밀림 | 8 × 300 = **2400 CSS px** = 4800 device px ✓ |
| 문서 높이 | 3,104 → **5,504 CSS px** |

`had_recent_input: true`라 **CLS 점수에는 들어가지 않는다.** 하지만 TODO 4번의 판정 기준은 점수가 아니라 현상이고, 실제 사용자 경험은 이렇다.

> `load more`를 누르면 그 버튼이 화면 밖 2400px 아래로 사라진다. 한 번 더 누르려면 8행을 스크롤해 내려가야 한다.

## 원인 3 — 그 시프트가 CLS에 가산되는 시프트를 하나 더 만든다

시프트는 회차마다 **3건씩, 같은 순서로** 찍힌다.

| # | 시각 (run1 / run2 / run3) | score | `dist` | `had_recent_input` | 정체 |
| --- | --- | --- | --- | --- | --- |
| 1 | 1211.3 / 1320.7 / 1180.6 | **0.278922** | 4800 | `true` | `load more` — 버튼·푸터가 뷰포트 밖으로 |
| 2 | 1213.8 / 1324.7 / 1183.9 | 0.002054 | 24 | `true` | **호버 진입** — 카드가 12px 위로 |
| 3 | 3482.6 / 2322.3 / 1989.1 | 0.002054 | 24 | **`false`** | **호버 이탈** — 카드가 12px 아래로 |

2·3번은 S3에서 확인한 `.gifItem:hover { top: -0.75rem }`의 서명 그대로다(`dist` 24 device px = 12 CSS px, `dirtyObjects` 7, `elementCount` 2).

**인과는 이렇다.** 사용자는 버튼을 누른 자리에 포인터를 그대로 두고 있었다. 1번 시프트로 버튼이 사라지자 그 좌표에 카드가 들어왔고(`old_rect [284, 710, 560, 552]` — 뷰포트 하단에 걸친 카드), 포인터가 움직이지 않았는데도 호버가 걸렸다. 나중에 포인터가 카드를 벗어날 때 3번이 찍히는데, 이때는 클릭 직후 500ms 창이 지나 있어 **`had_recent_input: false` → CLS에 그대로 가산된다(+0.00205).**

| 회차 | 녹화 종료 시점 누적 시프트 |
| --- | --- |
| run1 | 0.0237 |
| run2 | 0.0544 |
| run3 | 0.0668 |

회차 간 증가분이 각 회차의 3번 시프트와 일치한다. Home → Search가 클라이언트 라우팅이라 문서가 바뀌지 않아 세션 내내 누적된다(S3과 같음).

→ **`load more`는 직접적으로는 CLS에 잡히지 않지만, 호버를 강제로 걸어 CLS에 잡히는 시프트를 파생시킨다.** 원인 2를 고치면 이것도 같이 사라진다.

## 원인 4 — 새 GIF 16장이 52.67MB다 (S5 범위 밖 / TODO 1번)

```ts
// gifAPIService.ts:20
imageUrl: images.original.url
```

| 항목 | 값 (run1 = run3, 바이트까지 동일) |
| --- | --- |
| 요청 수 | 16 |
| **총 인코딩 크기** | **52.67MB** |
| 중앙값 | 2.60MB |
| 최대 | **10.33MB** (`GKIDY3db7IGvBO3z7e/giphy.gif`, 수신 445~463ms) |
| 1MB 초과 | **13 / 16** |
| 5MB 초과 | 3 / 16 |
| 전부 뜨기까지 | 클릭 + 485~766ms |

해상도 문제가 아니다. `PaintImage`의 `srcWidth × srcHeight`는 **480×480, 504×504, 400×400, 360×360**이고 표시 크기는 560×560 device px이다. **원본이 표시 크기보다 오히려 작아서 확대돼 그려진다.** 그런데도 10MB인 것은 GIF 포맷 자체(무손실 팔레트 + 프레임 전부 보관) 때문이다.

→ `images.original` 대신 `images.fixed_width`(또는 `.webp`) 계열로 바꾸는 것이 TODO 1번의 "이미지 크기 줄이기"에 해당한다. **S5 리포트 행에는 "추가 로드 후 드롭 프레임"으로 적되, 원인은 TODO 1번으로 넘긴다.**

## 프레임 정리 — 드롭의 원인이 두 개다

| 구간 | run1 | run2 (캐시) | run3 | 원인 |
| --- | --- | --- | --- | --- |
| 기준선 | 3 (6.0%) | 1 (1.6%) | 0 (0%) | GIF 재생 상시 부하 |
| **커밋 구간** | **2 / 4 (50%)** | **5 / 6 (83%)** | **2 / 4 (50%)** | **메인 100% 블로킹 (TODO 4-1)** |
| **이미지 구간** | **23 (23.5%)** | **1 (1.3%)** | **17 (18.1%)** | **52.67MB 수신·디코드 (TODO 1)** |

Partially Presented는 **커밋 구간에 0건**이고 이미지 구간에만 나온다(3 / 0 / 13). 캐시 회차가 0건이므로 **partial도 이미지 부하가 원인이다.**

`affects_smoothness`는 드롭·partial 전건 `false`, `frame_type`은 `FORKED` / `BACKFILL` / 미지정이 섞여 있다.

## CSS triggers 분류 — 실측 대조

| 대상 | 변경 내용 | csstriggers 분류 | 실측 |
| --- | --- | --- | --- |
| `SearchResult.tsx:19` 목록 확장 | DOM 노드 80개 삽입 | Layout → Paint → Composite | `Layout` 1회(`#document` 루트, `partialLayout: false`) + Shift 0.2789. **분류대로다** |
| `SearchResult.module.css:28` `transition: all 0.5s ease-in-out` (버튼) | — | — | **동작하지 않음.** `:hover`가 `background`를 같은 값으로 다시 선언할 뿐이라 바뀌는 속성이 없다 |
| `GifItem.module.css:17` `top` (파생 호버) | `auto` → `-0.75rem` | Layout → Paint → Composite | S3과 동일. 여기서는 시프트 3번의 원인 |

`.loadMoreButton`의 `transition: all 0.5s`는 S3의 `.gifItem`과 같은 유형의 선언 — **대상이 없는 트랜지션**이다. 비용은 없지만 `:hover`에서 실제로 바뀌는 속성이 없다는 사실이 선언만 봐서는 드러나지 않는다.

## 비교 지표 선택

네트워크 대기(17.9~210.9ms)와 이미지 캐시 상태가 회차마다 달랐으므로, 그 영향을 받는 값은 주 지표에서 뺀다.

| 지표 | run1 | run2 | run3 | 성질 |
| --- | --- | --- | --- | --- |
| **메인 블로킹 (API 완료 → `Commit` 종료)** | 32.67ms | 44.47ms | 28.64ms | **주 지표.** 캐시·네트워크 무관 |
| **`Recalculate Style`의 `elementCount`** | 80 | 80 | 80 | **주 지표.** 시간·환경 무관 |
| **Layout Shift score (load more)** | 0.278922 | 0.278922 | 0.278922 | **주 지표.** 창 너비 고정 시 완전 재현 |
| **`had_recent_input: false` 시프트 합** | 0.00205 | 0.00205 | 0.00205 | **주 지표** |
| 커밋 구간 Dropped 비율 | 50% | 83% | 50% | 보조 (분모가 4~6로 작다) |
| 이미지 구간 Dropped 비율 | 23.5% | 1.3% | 18.1% | **TODO 1번 지표.** S5 주 지표 아님 |
| 클릭 → 첫 프레젠트 | 263.9ms | 98.2ms | 65.3ms | **쓰지 않는다.** 대부분이 네트워크 대기 |

### INP는 이 문제를 못 잡는다

`EventTiming`의 클릭 `duration`은 **22.3 / 11.4 / 15.0ms**로 전부 "좋음" 구간이다. 클릭 핸들러가 `fetch`를 띄우고 바로 끝나므로 클릭 직후 프레임에는 아무 변화가 없고, 32~44ms 블로킹은 `await` 뒤에 일어나 INP 창 밖이다.
→ **S5의 개선 여부를 INP로 판정하면 안 된다.** 위 주 지표를 쓴다.

## 개선 후 목표

| 지표 | 개선 전 (6x 중앙값) | 목표 | 근거 |
| --- | --- | --- | --- |
| **메인 블로킹 (API 완료 → 커밋 종료)** | **32.67ms** | **< 16.7ms** | 기존 16장 리렌더 제거분 |
| **`Recalculate Style`의 `elementCount`** | **80** | **80 유지** | 이미 최소다. 160으로 **늘지 않는지**를 회귀 확인용으로 본다 |
| **React 렌더 태스크** | **18.91ms** | 단축 (수치는 React Profiler로) | `React.memo` |
| **Layout Shift score (load more)** | **0.278922** | **0** | 버튼·푸터가 밀리지 않아야 한다 |
| **밀림 거리** | **2400 CSS px** | **0** | TODO 4-2 |
| **`had_recent_input: false` 시프트** | **+0.00205 / 회** | **0** | 파생 호버가 안 생기면 사라진다 |
| **커밋 구간 Dropped** | **2 / 4 (50%)** | **0** | 블로킹이 프레임 예산 안에 들어오면 |
| 커밋 구간 Partially Presented | 0 | 0 유지 | — |
| 이미지 구간 Dropped | 23.5% | TODO 1번에서 처리 | S5 범위 밖 |
| 새 이미지 전송량 | **52.67MB / 16장** | TODO 1번에서 처리 | `images.original` 사용 |

**`elementCount`가 80에서 유지돼야 한다는 점이 중요하다.** `React.memo`를 붙이면서 `key`나 props 구조를 건드려 기존 카드가 언마운트·재마운트되면 이 값이 160으로 **늘어난다.** 개선이 아니라 악화다.

## 원인 정리

| 파일 | 내용 | 결과 |
| --- | --- | --- |
| `src/pages/Search/components/SearchResult/SearchResult.tsx:19` | `gifList.map` → `GifItem`에 `React.memo` 없음 | 추가 로드 시 32개 전부 리렌더. 비용은 JS 15~22ms에 몰려 있고 DOM 변경은 신규 80요소뿐 |
| `src/pages/Search/hooks/useGifSearch.tsx:65` | `setGifList([...prev, ...new])` | `SearchResult` 전체 리렌더 트리거 |
| `src/pages/Search/components/SearchResult/SearchResult.module.css:15-29` | `load more` 버튼이 목록 **아래**에 위치 | 목록이 늘면 버튼이 2400px 아래로 밀려 뷰포트에서 사라짐. Shift score **0.2789** |
| `src/components/Footer` | 목록 아래 | 같은 시프트에 포함 (뷰포트 점유분의 절반) |
| `src/pages/Search/components/GifItem/GifItem.module.css:17` | `:hover { top: -0.75rem }` | 위 시프트가 포인터 밑에 카드를 밀어 넣어 호버가 걸리고, 이탈 시프트가 **CLS에 가산(+0.00205)** |
| `src/apis/gifAPIService.ts:20` | `images.original.url` | 16장 **52.67MB**(최대 10.33MB) → 이후 1초 드롭 18~24%. **TODO 1번** |
| `src/pages/Search/components/SearchResult/SearchResult.module.css:28` | `transition: all 0.5s ease-in-out` | `:hover`에서 바뀌는 속성이 없어 미동작 |

## 해당 없음 — 리포트 S5 행에 쓰지 말 것

| 항목 | 결과 |
| --- | --- |
| 앱 코드 Long Task (>50ms) | **3회 모두 0건.** 녹화 시작 지점의 184.9 / 170.3 / 176.3ms 태스크는 DevTools 자신의 `ScriptCatchup`(소스 런다운)이다 |
| 강제 동기 레이아웃 (Forced reflow) | **3회 모두 0회.** 커밋 구간 `Layout` 전건에 `stackTrace` 없음 |
| 커밋 구간의 Partially Presented | **3회 모두 0건.** partial은 이미지 구간에만 나온다 |
| 클릭 → 첫 프레젠트 시간 | **65~264ms로 편차가 4배다.** 대부분이 네트워크 대기(17.9~210.9ms)라 비교 지표로 못 쓴다 |
| INP / `EventTiming` | **11.4~22.3ms로 "좋음".** 실제 블로킹은 `await` 뒤라 잡히지 않는다 |
| 여러 `Layout` 루트 / 부분 레이아웃 | 3회 전부 `layoutRoots: #document`, `partialLayout: false` |

## 다음 측정 때 확인할 것

- **창 너비를 S3과 맞춘다.** 이번은 864 CSS px(1행 2개), S3은 1476 CSS px(1행 4개)였다. 시프트 거리가 2배 차이난다. 고정할 값을 절차 문서에 적는다.
- **이미지 캐시 상태를 명시한다.** run2가 캐시 히트라 드롭률이 1.3%였다. 회차마다 상태가 다르면 이미지 구간 수치를 못 쓴다. 매 회차 `Disable cache`를 켜거나, 캐시 회차를 대조군으로 의도해서 남긴다.
- **클릭 후 포인터를 그리드 밖으로 뺀다.** 버튼이 밀려난 자리에 카드가 들어와 의도하지 않은 호버 시프트가 2건 추가됐다.
- **응답 대기 중 마우스를 움직이지 않는다** (절차 문서 §S5 "하지 말 것"). run1은 3.1초대에 포인터를 움직여 호버 시프트가 끼었다.
- **절차 문서 §S5의 구간을 둘로 쪼갠다.** "응답 직후 1초"는 커밋(30~45ms)과 이미지 수신(950ms)을 섞는다. `Commit` 종료를 경계로 구간을 나눠 각각 집계한다.
- 절차 문서 §S5에 "1행 4개" 같은 전제가 없는지 확인한다. 창 너비에 따라 추가 행 수가 4행 ↔ 8행으로 바뀐다.

## 측정 방법 메모

- **프레임 판정**: `PipelineReporter`의 `args.frame_reporter.state`(`STATE_DROPPED` / `STATE_PRESENTED_PARTIAL` / `STATE_PRESENTED_ALL`)를 썼다. `ph: 'b'`에만 `frame_reporter`가 붙으므로 `id2.local`로 b/e를 짝지어 구간을 얻었다. `STATE_NO_UPDATE_DESIRED`는 분모에서 뺐다.
- **⚠ `layer_tree_host_id`는 프로세스마다 따로 매겨진다.** 이번 트레이스에서 페이지 레이어 트리는 **host 1(Renderer pid 48073)** 이고, host 3·33은 **Browser 프로세스**의 것이다. `SetLayerTreeId`로 렌더러 pid와 대조해 확정했다. **`S3-before.metrics.md`는 "host 3 = 페이지, host 33 = 확장"으로 적었는데, S3 트레이스에서 host 3은 Browser(407건)와 Renderer/Compositor(814건)에 **둘 다** 걸려 있다.** S3의 프레임 개수는 브라우저 UI 프레임이 섞였을 가능성이 있으므로 (pid, host) 쌍으로 다시 세어 확인할 것.
- **커밋 구간 경계**: 시작은 `api.giphy.com` 요청의 `ResourceFinish`, 끝은 그 뒤 첫 `Commit`의 종료 시각. `Commit`은 `elementCount ≥ 80`인 `UpdateLayoutTree` 이후 첫 건으로 찾았다.
- **React 렌더 태스크 식별**: `ResourceFinish` 이후 스타일·레이아웃 태스크 **이전**의 최대 `RunTask`. 최상위 `FunctionCall`을 트레이스 내장 소스맵(`metadata.sourceMaps`)으로 풀어 `scheduler.production.min.js`임을 확인했다. 소스맵 없이 `bundle.js:1895`만 보면 앱 코드인지 라이브러리인지 구분되지 않는다.
- **`GifItem` 1장 = 5요소** (`div.gifItem` / `img.gifImage` / `div.gifTitleContainer` / `div.gifTitleBg` / `h4.gifTitle`). `elementCount` 80 = 16 × 5의 근거다.
- **시프트 score 검증**: `impacted_nodes`의 `old_rect` 면적 합 ÷ 뷰포트 면적 = 608,256 / 2,180,736 = 0.27892234548335976으로 실측 `score`와 소수점 15자리까지 일치. 이동 거리 4800 / 1728 = 2.78은 1.0으로 포화되므로 score는 impact fraction 그 자체다.
- **뷰포트 크기**: `PaintTimingVisualizer::Viewport`의 `viewport_rect`(CSS px). `LayoutShift`의 `rect`는 device px이라 단위가 다르다. DPR 2를 곱해 맞췄다.
- **메인 점유**: 렌더러 `CrRendererMain`의 `RunTask` 합 ÷ 구간 길이. 기준선 구간은 DevTools `ScriptCatchup` 태스크를 빼지 않은 값이므로 표 주석대로 읽는다.
