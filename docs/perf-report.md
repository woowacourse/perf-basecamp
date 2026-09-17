# 성능 측정 보고서

## LigthHouse - 성능

![image](./image/image0.png)

![image](./image/image1.png)

### 개선 사항

#### 1. 자바스크립트 줄이기

![image](./image/image2.png)

```js
optimization: {
  // 변경 전
  // minimize: false;
  minimize: true;
}
```

위 설정은 빌드 시 Javascript를 압축하지 않도록 하는 설정이기 때문에 true로 변경하여 공백, 줄바꿈 등을 줄였다.

![image](./image/image2.5.png)

- 변경 전

```bash
❯ ls -lh dist/bundle.js
gzip -c dist/bundle.js | wc -c
-rw-r--r--@ 1 iftype  staff   1.2M Sep 17 16:48 dist/bundle.js
  313504
```

- 변경 후

```bash
❯ ls -lh dist/bundle.js
gzip -c dist/bundle.js | wc -c
-rw-r--r--@ 1 iftype  staff   225K Sep 17 16:43 dist/bundle.js
   70496
```

용량은 1.2M에서 225K까지 줄게 됐으며, 빌드 산출물인 `bundle.js`를 확인하여 그 변경점을 확인할 수 있다.

#### 2. 사용하지 않는 자바스크립트 줄이기

![image](./image/image3.png)

- 변겅 전

```tsx
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
//...
```

- 변경 후

```tsx
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
//...
```

```tsx
const Home = lazy(() => import('./pages/Home/Home'));
const Search = lazy(() => import('./pages/Search/Search'));

const App = () => {
  return (
    // 추가
    <Suspense fallback={null}>
      <--생략-->
    </Suspense>
  );
};
```

lazy와 Suspense를 사용하여 페이지 단위로 청크를 나눠 페이지를 비동기로 로드했습니다.

이로서 초기 렌더링 시 Search 페이지를 로드하지않아 첫 진입시의 퍼포먼스를 개선할 수 있었습니다.

![alt text](image/image4.png)
네트워크 탭에서 Search 페이지로 진입 시 새로 번들을 요청하는 것을 확인할 수 있습니다.
