# 최소한의 변경만 일으키기

## 문제 상황

화면의 일부만 바뀌어도 기존 컴포넌트가 함께 다시 렌더되거나, 애니메이션이 Layout과 Paint를 반복해서 일으키면 메인 스레드의 작업량이 증가한다.

기존 애플리케이션에는 다음과 같은 문제가 있었다.

- 검색 결과를 추가할 때 기존 `GifItem`도 부모와 함께 다시 렌더될 수 있었다.
- GIF hover가 `top`, 도움말 패널이 `right` 속성을 변경해 Layout을 유발했다.
- CustomCursor가 마우스 이벤트마다 React state를 갱신하고 `top`, `left`를 변경했다.
- 스크롤 이벤트마다 React state를 갱신해 SVG 경로 컴포넌트를 다시 렌더했다.
- 고빈도 `mousemove`, `scroll` 이벤트가 브라우저의 화면 갱신 주기와 무관하게 실행됐다.

---

## 개선 목표

- 추가 로드시 새 검색 결과만 렌더한다.
- 대상 애니메이션은 요소의 레이아웃을 바꾸지 않는다.
- 마우스와 스크롤 작업을 한 프레임에 최대 한 번만 수행한다.
- 고빈도 이벤트 때문에 React 렌더링이 반복되지 않도록 한다.
- 브라우저 렌더링 파이프라인에서 Layout과 Paint 작업을 줄이고 Composite 중심으로 처리한다.

---

## 1. 검색 결과의 불필요한 렌더링 방지

### `GifItem` 메모이제이션

검색 결과에 `React.memo`를 적용했다.

```tsx
const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  // ...
};

export default memo(GifItem);
```

추가 로드시 부모의 결과 배열은 변경되지만, 기존 아이템의 `imageUrl`과 `title`은 같은 문자열 값을 유지한다. `React.memo`의 얕은 비교를 통과한 기존 아이템은 렌더링을 건너뛰고 새로 추가된 아이템만 렌더링한다.

이미지에는 지연 로딩과 비동기 디코딩도 적용했다.

```tsx
<img src={imageUrl} alt={title} loading="lazy" decoding="async" />
```

브라우저 동작 확인 결과 검색 후 16개였던 결과가 추가 로드 후 32개로 늘었으며, 기존 16개의 이미지 URL과 제목은 그대로 유지됐다.

### React DevTools Profiler 확인 방법

1. Search 페이지에서 검색한다.
2. React DevTools의 Profiler에서 녹화를 시작한다.
3. `Load More`를 누른다.
4. 녹화를 중지하고 `GifItem`의 렌더링 결과를 확인한다.
5. 새로 추가된 아이템만 렌더되고 기존 아이템에는 렌더 표시가 없는지 확인한다.

---

## 2. Layout Shift 없는 애니메이션

브라우저 렌더링은 대략 다음 순서로 진행된다.

```text
JavaScript → Style → Layout → Paint → Composite
```

`top`, `left`, `right`처럼 요소의 위치와 크기에 영향을 주는 속성을 변경하면 Layout부터 다시 수행될 수 있다. 반면 `transform`과 `opacity`는 레이아웃을 바꾸지 않으며, 레이어가 분리된 경우 Composite 단계 중심으로 처리할 수 있다.

### CustomCursor

기존에는 마우스 좌표를 React state에 저장한 뒤 `top`, `left`에 반영했다. 이를 DOM ref와 `transform: translate3d()`를 사용하는 방식으로 변경했다.

```ts
cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
```

커서를 `position: fixed`로 배치해 viewport 좌표인 `clientX`, `clientY`와 일치시켰고 `will-change: transform`을 적용했다.

### 검색 결과 hover

```css
.gifItem {
  transition: transform 0.2s ease-in;
}

.gifItem:hover {
  transform: translateY(-0.75rem);
}
```

기존 `top: -0.75rem`과 `transition: all`을 제거했다. hover 중에도 계산된 `top`은 `0`으로 유지되고 transform 행렬의 Y 값만 `-12px`로 변경되는 것을 확인했다.

### 도움말 패널

```css
.selectedItemContainer {
  right: 0;
  transform: translateX(100%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.5s..., opacity 0.5s...;
}

.selectedItemContainer.showSheet {
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
```

기존에는 `right: -320px`에서 `right: 0`으로 이동했다. 변경 후에는 `right: 0`을 유지하면서 transform만 `320px`에서 `0`으로 바뀐다. 렌더링 비용이 큰 `backdrop-filter`도 제거했다.

---

## 3. Frame Drop 줄이기

### 이벤트를 화면 갱신 주기에 맞추기

`mousemove`와 `scroll`은 한 프레임 안에서도 여러 번 발생할 수 있다. 두 이벤트 모두 `requestAnimationFrame`으로 묶어 화면 갱신 전에 최대 한 번만 DOM을 변경하도록 했다.

```ts
if (animationFrameId === null) {
  animationFrameId = window.requestAnimationFrame(update);
}
```

이벤트 리스너에는 `{ passive: true }`를 적용했고, 컴포넌트가 사라질 때 예약된 animation frame도 취소한다.

### CustomCursor의 React 렌더링 제거

마우스가 움직일 때마다 state가 변경되던 `useMousePosition` 훅을 제거했다. 이제 마우스 이동은 CustomCursor 컴포넌트의 React 렌더링을 일으키지 않고 ref의 transform만 변경한다.

### 스크롤 SVG의 React 렌더링 제거

기존에는 스크롤마다 `strokeOffset` state를 변경했다. 변경 후에는 경로 전체 길이를 처음 한 번만 계산하고, 스크롤 시 DOM style만 갱신한다.

```ts
pathLengthRef.current = path.getTotalLength();
path.style.strokeDasharray = `${pathLengthRef.current}`;

// 스크롤 시
path.style.strokeDashoffset = `${nextOffset}`;
```

스크롤과 resize 이벤트는 하나의 `requestAnimationFrame` 스케줄을 공유하므로, 같은 프레임에 이벤트가 반복돼도 경로 계산과 DOM 변경은 한 번만 수행된다.

---

## 확인 결과

### 자동 및 브라우저 동작 확인

- TypeScript 검사 통과: `npx tsc --noEmit`
- 프로덕션 빌드 통과: `npm run build:prod`
- 검색 결과 추가 로드: 16개에서 32개로 증가, 기존 16개 데이터 유지
- GIF hover: `top: 0` 유지, `transform`의 Y 값만 변경
- 도움말 패널: `right: 0` 유지, 열고 닫을 때 `transform`과 `opacity` 변경
- CustomCursor: `position: fixed`, `translate3d()`로 위치 변경
- 스크롤 SVG: 스크롤 후 `stroke-dashoffset`이 DOM style에서 변경

### Chrome DevTools Performance 확인 방법

1. Performance 패널에서 CPU throttling을 설정하고 녹화를 시작한다.
2. Home에서 커서를 빠르게 움직이고 페이지를 연속으로 스크롤한다.
3. 녹화를 중지하고 Frames 트랙의 dropped frame과 partially presented frame을 확인한다.
4. Main 트랙에서 긴 `Layout`, `Paint`, `Long Task`가 반복되지 않는지 확인한다.
5. Rendering 패널의 `Layout Shift Regions`와 `Paint Flashing`을 켜고 대상 애니메이션을 다시 실행한다.

개발자 도구의 Performance 녹화 결과는 실행 환경과 조작 속도에 따라 달라진다. 따라서 Frame Drop 수치와 React 렌더 횟수는 위 절차로 최종 캡처한 뒤 기록해야 한다.

---

## 장점

- 추가 로드 시 기존 GIF 아이템의 불필요한 React 렌더링을 줄인다.
- 위치 애니메이션에서 Layout Shift와 반복 Layout 가능성을 줄인다.
- 마우스와 스크롤 이벤트가 브라우저의 프레임 주기에 맞춰 실행된다.
- 고빈도 이벤트가 React 컴포넌트 트리의 렌더링으로 이어지지 않는다.
- SVG 경로 길이를 반복 계산하지 않는다.
- `transition: all`을 제거해 의도하지 않은 속성까지 애니메이션되는 것을 방지한다.

## 단점과 고려 사항

- ref를 이용한 직접 DOM 변경은 선언적인 React state보다 동작을 추적하기 어렵다.
- `React.memo`는 props 비교 비용이 있으므로 모든 컴포넌트에 무조건 적용하면 안 된다.
- `will-change`는 레이어 메모리를 사용하므로 변화가 잦은 대상에만 제한해서 사용해야 한다.
- SVG 경로 애니메이션은 Layout을 피하더라도 매우 복잡한 경로에서는 Paint 비용이 남을 수 있다.
- 기기 성능과 화면 주사율에 따라 Frame Drop 결과가 달라질 수 있어 실제 DevTools 측정이 필요하다.

## 체크리스트

- [x] 검색 결과 `GifItem`에 `React.memo` 적용
- [x] 추가 로드 시 기존 결과의 props 유지 확인
- [x] CustomCursor를 `transform` 기반 애니메이션으로 변경
- [x] 검색 결과 hover를 `transform` 기반 애니메이션으로 변경
- [x] 도움말 패널을 `transform`과 `opacity` 기반 애니메이션으로 변경
- [x] 마우스와 스크롤 이벤트에 `requestAnimationFrame` 적용
- [x] 고빈도 이벤트의 React state 업데이트 제거
- [ ] React DevTools Profiler 캡처로 기존 `GifItem` 미렌더링 최종 확인
- [ ] Chrome DevTools Performance 녹화로 Frame Drop 최종 확인
- [ ] Chrome DevTools Rendering에서 Layout Shift 최종 확인
