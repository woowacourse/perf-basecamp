# 필요한 것만 요청하기

## 문제 상황

기존에는 Home과 Search 페이지를 정적으로 import하고 있어 Home에 접속해도 Search 페이지 코드와 `react-icons`가 모두 `bundle.js`에 포함됐다.

```tsx
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
```

## 개선 목표

- Home 초기 스크립트에서 Search 페이지 코드를 제외한다.
- Search 코드는 `/search` 진입 시에만 요청한다.
- `react-icons`에서 실제 사용하는 아이콘만 빌드 결과에 포함한다.

---

## Route-based Code Splitting

Search의 정적 import를 제거하고 React `lazy()`와 동적 import를 적용했다.

```tsx
import { lazy, Suspense } from 'react';

const Search = lazy(
  async () => await import(/* webpackChunkName: "search" */ './pages/Search/Search')
);
```

동적 컴포넌트는 로딩이 완료되기 전까지 렌더링할 수 없으므로 `Suspense`로 감쌌다.

```tsx
<Route
  path="/search"
  element={
    <Suspense fallback={null}>
      <Search />
    </Suspense>
  }
/>
```

webpack은 `import()`를 기준으로 별도의 비동기 청크를 생성한다.

```text
Home 접속
  └─ bundle.js

Search 이동
  ├─ chunks/search.[hash].js
  └─ react-icons vendor chunk
```

분리된 파일을 DevTools에서 쉽게 구분할 수 있도록 청크 파일명도 설정했다.

```js
output: {
  filename: 'bundle.js',
  chunkFilename: 'chunks/[name].[contenthash:8].js'
}
```

TypeScript가 `webpackChunkName` 주석을 webpack보다 먼저 제거하지 않도록 설정했다.

```json
{
  "compilerOptions": {
    "removeComments": false
  }
}
```

프로덕션 결과물에서는 Terser가 불필요한 주석을 제거하므로 최종 크기에는 영향을 주지 않는다.

## Code Splitting 결과

| 리소스             | Home 초기 요청 | 원본 크기 | Brotli 크기 |
| ------------------ | -------------- | --------: | ----------: |
| `bundle.js`        | O              |    186KiB |      54.9KB |
| `search.[hash].js` | X              |   17.8KiB |       4.9KB |
| 아이콘 vendor 청크 | X              |   3.28KiB |      1.27KB |

Search와 아이콘 청크는 webpack 통계에서 `initial: false`로 확인됐다. 따라서 Home에서는 요청하지 않고 `/search`로 이동할 때 요청한다.

```text
Home 초기 JavaScript
변경 전: 약 205KiB
변경 후: 약 186KiB
```

Search 기능이 커져도 Home 초기 번들에 영향을 주지 않는 경계가 만들어졌다는 점이 핵심이다.

---

## react-icons Tree Shaking

Search 페이지에서는 다음 세 개의 아이콘만 사용한다.

```tsx
import { AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import { AiOutlineSearch } from 'react-icons/ai';
```

`react-icons`는 ES Module과 `sideEffects: false` 설정을 제공한다. 현재 프로젝트도 TypeScript의 `module: "esnext"` 설정으로 ES Module 문법을 유지하고 있으며, 프로덕션 Terser가 사용하지 않는 export를 제거한다.

Bundle Analyzer 통계의 `usedExports`를 확인한 결과 실제 사용하는 세 개만 남았다.

```text
usedExports:
- AiOutlineClose
- AiOutlineInfo
- AiOutlineSearch
```

최종 아이콘 청크는 3.28KiB이며 Brotli 압축 시 약 1.27KB다. 이 청크도 Search 전용 비동기 청크이므로 Home에서는 요청하지 않는다.

---

## Bundle Analyzer

분석 빌드를 반복할 수 있도록 명령어를 추가했다.

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build:prod"
  }
}
```

```bash
npm run analyze
```

빌드 후 다음 결과가 생성된다.

- `dist/report.html`: 번들 구성을 시각적으로 확인
- `dist/stats.json`: 청크, 모듈, `usedExports` 확인

검증 결과는 다음과 같다.

```text
searchInMain: false

usedIcons:
- AiOutlineClose
- AiOutlineInfo
- AiOutlineSearch
```

## 장점

- Home에서 사용하지 않는 Search 코드를 다운로드하지 않는다.
- Home의 JavaScript 전송량과 파싱 비용이 감소한다.
- Search 기능이 커져도 Home 초기 번들에 미치는 영향이 줄어든다.
- 사용하는 아이콘 세 개만 최종 결과에 포함된다.
- Network 패널에서 청크의 요청 시점을 쉽게 확인할 수 있다.

## 단점과 고려 사항

- Search 첫 진입 시 청크 네트워크 요청이 추가된다.
- 느린 네트워크에서는 짧은 로딩 상태가 보일 수 있다.
- 현재 `Suspense` fallback이 `null`이므로 필요하면 로딩 UI를 추가해야 한다.
- 청크를 지나치게 많이 나누면 요청 관리 비용이 증가한다.
- 빌드 설정이나 패키지가 변경되면 Tree Shaking 결과를 다시 확인해야 한다.

## Chrome DevTools 검증 방법

1. Home에서 Network 패널을 연다.
2. 캐시를 비활성화하고 새로고침한다.
3. JS 필터에서 `bundle.js`만 요청되는지 확인한다.
4. Search 페이지로 이동한다.
5. `search.[hash].js`와 아이콘 청크가 이때 요청되는지 확인한다.

## 체크리스트

- [x] Home 초기 번들에서 Search 코드 제외
- [x] Search 페이지 동적 import 적용
- [x] Search 진입 시에만 비동기 청크 요청
- [x] 사용하는 `react-icons` 아이콘만 포함
- [x] Search와 아이콘 청크를 Home 초기 요청에서 제외
- [x] Bundle Analyzer 실행 및 통계 검증
- [x] 프로덕션 빌드 성공
- [ ] 배포 환경의 Network 패널에서 재검증
