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

#### 3. 번들 사이즈 줄이기(css)

`style-loader`는 CSS 삽입을 위한 런타임 코드가 JavaScript 번들에 포함되게 함으로 번들 크기를 줄이기 위해 최적화 플러그인을 설치해줬습니다.

```js
// webpack.config.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
```

`css-minimizer-webpack-plugin` : JavaScript 번들 안에 포함되던 CSS를 별도의 .css 파일로 추출할 수 있게함
`mini-css-extract-plugin` : CSS를 압축해줌, 위 플러그인을 사용해서 별도의 .css 파일로 추출해서 사용 가능

#### 4. 이미지 최적화(확장자 변환)

![image](./image/image6.png)
![image](./image/image7.png)

라이트하우스의 조언에 따라 이미지와 gif의 확장자를 변경했다.

##### 이미지

```bash

# 변환 전
❯ ls -lh src/assets/images/hero.png
-rw-r--r--@ 1 iftype  staff    10M Sep 16 15:50 src/assets/images/hero.png

# 변환 후
-rw-r--r--@ 1 iftype  staff   200K Sep 20 11:57 src/assets/images/hero.webp

```

현재 히어로 이미지는 10M으로 너무 크다고 생각해 webp로 변환하여 200kb까지 줄일 수 있었습니다

![image](./image/image5.png)

그 결과 성능을 98점까지 올릴 수 있었습니다.

##### GIF

```tsx
interface FeatureItemProps {
  title: string;
  type: 'gif' | 'mp4';
  src: string;
}
```

```tsx
type === 'gif' ? (
  <img className={styles.featureImage} src={src} />
) : (
  <video className={styles.featureImage} autoPlay loop playsInline muted preload="metadata">
    <source src={src} type="video/mp4" />
  </video>
);
```

GIF 이미지도 영상으로 변경하여 넣어줬습니다. 이미지만 받고있던 `FeatureItem` 컴포넌트에서 비디오도 받을 수 있도록 변경하였습니다.

gif와 동일한 기능을 하기위해 자동재생, 루프를 사용했고 autoplay를 사용하고 있기 때문에 preload 속성이 제대로 동작하진 않지만 의도를 드러내기 위해 사용했습니다.

##### 개선 이후

![image](./image/image8.png)

개선 이후 눈에 띄게 크기와 콘텐츠 다운로드가 줄어들었습니다.
