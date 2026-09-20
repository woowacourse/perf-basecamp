# load more (렌더 범위) — 개선 전 측정 지표

> 원본 프로파일: `loadmore-before.json`(16→32), `loadmore-before-why.json`(32→48, 리렌더 원인 포함)
> 측정일: 2026-09-20 14:57 / 15:28 KST · 대상 커밋 `ad9bc9b`
> 절차: [measure-react-profiler.md](../measure-react-profiler.md) · 상위 층 측정: [S5-before.metrics.md](../performance/S5-before.metrics.md)

## 결론 먼저

**`load more` 한 번에 147개 컴포넌트가 렌더되고, 그중 129개(88%)가 불필요하다.**

| 항목 | 값 | 판정 |
| --- | --- | --- |
| 커밋 수 | **1** | ✅ React 18 automatic batching 정상 동작 |
| 렌더된 컴포넌트 수 | **147** | — |
| └ 정당한 렌더 | **18** (신규 `GifItem` 16 + `SearchResult` + `Search`) | — |
| └ **불필요한 렌더** | **129 (88%)** | ❌ |
| **기존 목록 아이템 리렌더 여부** | **16개 전부 리렌더됨** | ❌ **TODO 4-1 미달** |
| 언마운트 / reorder | 0개 / 1회 | ✅ `key={gif.id}`는 정상 |
| 커밋 소요 시간 | 1.8ms | 참고값 (개발 빌드, 스로틀링 미기록) |

- 불필요한 129개 중 **`GifItem` 16개보다 `ArtistInfo` 100개가 더 많다.** 사용자가 열지도 않은 `HelpPanel` 내부 목록이 `load more`마다 통째로 다시 렌더된다.
- 그 129개는 **props가 하나도 바뀌지 않았다**(`props: []`). 부모가 렌더돼서 따라 렌더된 것뿐이라 `React.memo`만으로 전부 제거된다.
- 반면 **`SearchResult`와 `SearchBar`는 props가 실제로 바뀐다.** 원인은 `gifList`가 아니라 **매 렌더 새로 만들어지는 함수**(`loadMore`, `onChange` 등)다. 이 둘에 `memo`만 씌우면 효과가 없다.
- S5가 남긴 미해결 질문("기존 16장이 리렌더되는가")이 여기서 닫힌다. **리렌더된다. 다만 DOM은 안 바뀐다**(S5의 `elementCount: 80`과 모순 없음). 낭비는 전부 JS 시간 안에 있다.

## 측정 환경

| 항목 | 값 |
| --- | --- |
| 측정 URL | `http://localhost:8080/perf-basecamp/search` (로컬 개발 서버 `npm run serve`) |
| 빌드 | development. Profiler는 프로덕션 빌드에서 기록되지 않는다 |
| `webpack.config.js` | 측정을 위해 `optimization.minimize: false`로 전환 |
| `StrictMode` | 없음 (`src/index.tsx`) → 개발 모드 이중 렌더 없음 |
| Profiler 설정 | `Record why each component rendered` — 1차 **꺼짐**, 2차 **켜짐** |
| 측정 횟수 | 시나리오당 1회 (렌더 범위는 결정적 값이라 회차 편차가 없다) |
| CPU 스로틀링 | **미기록** — 시간 값은 비교 지표가 아니므로 결론에 영향 없음 |
| 검색어 | **미기록** |

> `load more` 버튼은 **검색 결과(`FOUND`) 상태에서만** 렌더된다(`SearchResult.tsx:37`). trending 목록(`BEFORE_SEARCH`)에는 버튼이 없으므로 반드시 검색을 한 번 거쳐야 한다. 절차 문서 §1의 "trending 16개가 뜨면 load more를 누른다"는 성립하지 않는다.

### 두 파일의 시작 상태가 다르다

| | `loadmore-before.json` | `loadmore-before-why.json` |
| --- | --- | --- |
| 시작 목록 | **16개** | **32개** (새로고침 없이 2회차) |
| 추가 후 | 32개 | 48개 |
| 렌더된 컴포넌트 | **147** | 163 |
| 불필요 | **129 (88%)** | 145 (89%) |
| 커밋 소요 | 1.8ms | 2.3ms |
| 리렌더 원인 기록 | ❌ | ✅ |

**리포트에는 1차(16→32)의 횟수와 2차의 원인을 쓴다.** S5가 16→32 조건에서 측정됐으므로 횟수는 1차가 맞고, 원인(`props: []`, `loadMore` 참조 변경)은 목록 길이와 무관한 구조적 사실이라 2차 값을 그대로 쓸 수 있다.

두 회차를 비교하면 **낭비가 목록 길이에 선형으로 비례**한다는 것도 확인된다. 기존 아이템 수만큼 리렌더가 늘어난다(16개 → 32개).

## 커밋 구성

**커밋은 1개다.** `useGifSearch.tsx:65`의 `setGifList`와 다음 줄 `setCurrentPageIndex`가 `await` 뒤에서 호출되는데도 React 18의 automatic batching이 하나로 묶었다. 절차 문서 §3-1이 경계한 "2커밋 이상"은 발생하지 않는다.

| 항목 | 값 |
| --- | --- |
| `updaters` | **`Search`** (`useGifSearch`의 state를 들고 있는 컴포넌트) |
| `priorityLevel` | `Normal` |
| 신규 마운트 | `GifItem` **16개** (id 170~185), 부모는 전부 `SearchResult`(id 28) |
| 언마운트 | **0개** |

언마운트 0개는 중요하다. `key`가 정상 동작해 기존 카드가 재사용됐다는 뜻이고, S5의 `elementCount: 80`(신규 16장 × 5요소)이 160으로 늘지 않은 이유다.

## 렌더 원인 전체 지도

`loadmore-before-why.json`의 `changeDescriptions` 160건을 컴포넌트별로 묶은 결과다.

| 컴포넌트 | 개수 | 원인 | 판정 |
| --- | --- | --- | --- |
| `Search` | 1 | **hook 1·2 변경** | ✅ 정당 |
| `SearchResult` | 1 | **props 변경** (`gifList`, **`loadMore`**) | ⚠️ `loadMore`는 불필요 |
| `GifItem` (신규) | 16 | 첫 마운트 | ✅ 정당 |
| **`GifItem` (기존)** | **32** | **부모가 렌더됨 (props 변경 0)** | ❌ 순수 낭비 |
| **`ArtistInfo`** | **100** | **부모가 렌더됨 (props 변경 0)** | ❌ 순수 낭비 |
| `HelpPanel` / `ArtistList` / `ResultTitle` / `AiOutlineInfo` / `AiOutlineClose` | 5 | 부모가 렌더됨 (props 변경 0) | ❌ 낭비 |
| `SearchBar` | 1 | **props 변경** (`onEnter`, `onChange`, `onSearch`) | ⚠️ 전부 불필요 |
| `AiOutlineSearch` | 1 | 부모가 렌더됨 | ❌ 낭비 |
| `IconBase` | 3 | props 변경 (`attr`, `children`) | react-icons 내부 |

### `Search`의 hook 1·2가 정확히 무엇인가

```jsonc
"Search": { "didHooksChange": true, "hooks": [1, 2], "props": [] }
```

`useGifSearch`의 `useState` 선언 순서(0-based)와 대조하면 정확히 일치한다.

| index | state | `loadMore`가 바꾸는가 |
| --- | --- | --- |
| 0 | `status` | — |
| **1** | **`currentPageIndex`** | ✅ `setCurrentPageIndex(nextPageIndex)` |
| **2** | **`gifList`** | ✅ `setGifList([...prev, ...new])` |
| 3 | `searchKeyword` | — |
| 4 | `errorMessage` | — |

**`load more`가 건드리는 state는 이 둘뿐이고, 둘 다 바뀌어야 하는 값이다.** 업데이트 자체는 낭비가 없다. 문제는 그 아래로 퍼지는 범위다.

## 원인 1 — 기존 `GifItem` 전부가 부모 렌더에 딸려 온다 (TODO 4-1)

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

기존 `GifItem` 32개(2차 기준)의 change description이 전부 동일하다.

```json
{ "props": [], "state": null, "hooks": [], "isFirstMount": false, "context": false }
```

**`props: []` — 바뀐 props가 하나도 없다.** `imageUrl`과 `title`은 원시값이고 `key`도 `gif.id`로 안정적이다. `GifItem`에 `React.memo`가 없어서 부모 렌더가 그대로 자식까지 내려간 것뿐이다.

→ **`React.memo(GifItem)` 단독으로 해결된다.** 얕은 비교가 100% 통과하므로 다음 커밋부터 기존 아이템은 전부 bailout 된다.

## 원인 2 — 닫혀 있는 `HelpPanel`이 낭비의 78%다

이번 측정에서 새로 드러난 항목이다. 불필요한 129개 중 **100개가 `ArtistInfo`**다.

```tsx
// Search.tsx:27-30
<SearchBar ... />
<SearchResult status={status} gifList={gifList} loadMore={loadMore} />
<HelpPanel />          // ← SearchResult의 형제
```

`HelpPanel`은 `SearchResult`의 형제라서, `gifList` 변경으로 `Search`가 리렌더되면 `HelpPanel` → `ArtistList` → `ArtistInfo` 100개가 통째로 따라 렌더된다. `isShow`는 `false`(패널 닫힘) 상태이고, 패널은 CSS로 화면 밖에 있다.

서브트리 비용으로 보면 규모가 드러난다.

| 컴포넌트 (서브트리) | 1차 (16→32) | 2차 (32→48) |
| --- | --- | --- |
| `Search` (커밋 전체) | 1.8ms | 2.3ms |
| `SearchResult` | 0.7ms | 1.1ms |
| **`HelpPanel`** | **0.9ms** | **1.0ms** |
| └ `ArtistList` | 0.8ms | 1.0ms |

**1차에서는 `HelpPanel`(0.9ms)이 `SearchResult`(0.7ms)보다 비쌌다.** 목록이 짧을수록 비중이 더 크다.

`ArtistInfo`도 change description이 `props: []`다. `artistUtil.ts`의 `artists`가 모듈 레벨 상수이고 `getArtists()`가 같은 배열 참조를 돌려주므로 **props 참조가 이미 안정적이다.** → `React.memo(ArtistInfo)`(또는 `ArtistList`) 단독으로 해결된다.

## 원인 3 — 함정: `SearchResult`·`SearchBar`는 `memo`가 안 먹힌다

```json
"SearchResult": { "props": ["gifList", "loadMore"] }
"SearchBar":    { "props": ["onEnter", "onChange", "onSearch"] }
```

`gifList`는 실제로 바뀌니 정당하다. 나머지는 전부 **매 렌더마다 새로 만들어지는 함수 참조**다.

| props | 생성 위치 | 문제 |
| --- | --- | --- |
| `loadMore` | `useGifSearch.tsx:59` | 렌더마다 새 함수 |
| `onSearch` (`searchByKeyword`) | `useGifSearch.tsx` | 렌더마다 새 함수 |
| `onChange` (`updateSearchKeyword`) | `useGifSearch.tsx:25` | 렌더마다 새 함수 |
| `onEnter` (`handleEnter`) | `Search.tsx:14` | 렌더마다 새 함수 |

절차 문서 §"결과 읽는 법"이 예고한 케이스 그대로다.

> `React.memo`를 붙였는데도 렌더되고 원인이 `Props changed` → 매 렌더마다 새로 만들어지는 값이 props로 내려가고 있다

→ **이 둘은 `useCallback`이 세트로 필요하다.** `GifItem`·`ArtistInfo`와 달리 `memo` 단독으로는 효과가 없다.

`IconBase` 3건의 `props: ["attr", "children"]`은 `react-icons` 내부에서 매 렌더 새 객체를 만들어 생기는 것이다. 라이브러리 코드라 직접 손대지 않고, `SearchBar`를 막으면 위에서 끊긴다.

## 개선 후 목표

| 지표 | 개선 전 | 목표 | 근거 |
| --- | --- | --- | --- |
| **렌더된 컴포넌트 수 (16→32)** | **147** | **≤ 20** | 신규 16 + `Search` + `SearchResult` + α |
| **기존 `GifItem` 리렌더** | **16개 전부** | **0개** | TODO 4-1 판정 기준 |
| **`ArtistInfo` 리렌더** | **100개** | **0개** | — |
| 커밋 수 | 1 | **1 유지** | 2개로 늘면 batching이 깨진 것 |
| 언마운트 | 0 | **0 유지** | `key` 유지 확인 |
| `SearchResult`의 변경 props | `gifList`, `loadMore` | **`gifList`만** | `useCallback(loadMore)` |
| `SearchBar`의 변경 props | 핸들러 3개 | **없음** | `useCallback` 3개 |
| 커밋 소요 시간 | 1.8ms | 판정에 쓰지 않음 | 개발 빌드 값 |

연계 확인 항목 — **S5의 `Recalculate Style` `elementCount`가 80에서 유지돼야 한다.** `memo`를 붙이면서 `key`나 props 구조를 건드려 기존 카드가 재마운트되면 이 값이 160으로 늘고, Profiler의 언마운트 수도 0이 아니게 된다. 개선이 아니라 악화다.

## 원인 정리

| 파일 | 내용 | 결과 |
| --- | --- | --- |
| `src/pages/Search/components/GifItem/GifItem.tsx` | `React.memo` 없음 | 기존 아이템 16개(2차 32개) 전부 리렌더. props 변경 0 |
| `src/pages/Search/components/ArtistInfo/ArtistInfo.tsx` | `React.memo` 없음 | 닫힌 패널의 100개가 매번 리렌더. **낭비의 78%** |
| `src/pages/Search/hooks/useGifSearch.tsx:25,59` | `updateSearchKeyword`, `loadMore` 등이 `useCallback` 없음 | `SearchResult`·`SearchBar`에 `memo`를 씌워도 통과해 버림 |
| `src/pages/Search/Search.tsx:14` | `handleEnter`가 렌더마다 생성 | 위와 동일 |
| `src/pages/Search/Search.tsx:30` | `HelpPanel`이 `SearchResult`의 형제 | `gifList` 변경이 패널 전체로 전파 |

## 해당 없음 — 리포트에 쓰지 말 것

| 항목 | 결과 |
| --- | --- |
| 커밋 분할 | **1커밋.** automatic batching 정상. 절차 문서 §3-1의 우려는 해당 없음 |
| `key` 문제 / 재마운트 | **언마운트 0건.** `key={gif.id}`는 문제 없다 |
| context 전파 | 전 컴포넌트 `context: false`. 라우터 context는 원인이 아니다 |
| 커밋 소요 시간 | 1.8 / 2.3ms. **개발 빌드 + 스로틀링 미기록이라 판정 기준이 아니다** |
| `Search`의 state 업데이트 | hook 1·2(`currentPageIndex`, `gifList`)만 변경. 과잉 업데이트 없음 |

## 다음 측정 때 확인할 것

- **CPU 스로틀링과 검색어를 기록한다.** 이번엔 둘 다 남지 않았다. 렌더 범위 판정에는 영향이 없지만 시간 값을 참고로도 쓰려면 조건이 같아야 한다.
- **새로고침 후 16개 상태에서 시작한다.** 2차는 32개에서 시작해 시작 조건이 달라졌다.
- **`Record why each component rendered`를 녹화 전에 켠다.** 1차는 꺼진 채로 찍혀 `changeDescriptions`가 `null`이었다.
- **검색어 입력 시나리오도 잰다.** `searchKeyword`가 `useGifSearch`에 있어 한 글자마다 같은 전파가 일어날 것으로 보이나 아직 미측정이다.

## 측정 방법 메모

- **"렌더됐다"의 판정 기준**: `commitData[].fiberActualDurations`에 항목이 있는 fiber. React DevTools 백엔드는 `didFiberRender()`가 참인 fiber만 여기에 넣으므로, **bailout된 컴포넌트는 애초에 들어오지 않는다.** 따라서 이 배열의 길이가 곧 "렌더된 컴포넌트 수"이고 절차 문서의 `Ranked` 탭 행 수와 같다.
- **신규 마운트 식별**: `snapshots`(녹화 시작 시점 트리)에 없는 fiber id. `operations` 배열을 디코드해 교차 검증했다 — `TREE_OPERATION_ADD` 16건, 전부 `GifItem`, 부모 id 28(`SearchResult`), `TREE_OPERATION_REMOVE` 0건.
- **⚠ `operations` 디코딩**: `ADD` 오퍼레이션의 페이로드가 7개다(`id`, `type`, `parentID`, `ownerID`, `displayNameStringID`, `keyStringID`, **`compiledWithForget`**). 마지막 필드는 React Compiler 대응으로 추가된 것으로, 6개로 읽으면 오프셋이 밀려 엉뚱한 값이 나온다.
- **`props: []`의 의미**: `changeDescriptions`의 `props`는 **바뀐 props의 이름 목록**이다. 빈 배열은 "props를 받지만 바뀐 것이 없다"는 뜻이고, 절차 문서의 `The parent component rendered`에 해당한다.
- **hook 인덱스**: `changeDescriptions[].hooks`는 0-based 인덱스다. `useGifSearch`의 `useState` 선언 순서와 대조해 `currentPageIndex`·`gifList`로 확정했다.
- **서브트리 vs 자기 비용**: `fiberActualDurations`는 자식을 포함한 서브트리 비용, `fiberSelfDurations`는 자기 비용이다. `ArtistInfo` 100개의 self 합은 0.3ms로 개별 비용은 작다. **문제는 단가가 아니라 개수이고, 개수는 목록 길이에 비례해 늘어난다.**
