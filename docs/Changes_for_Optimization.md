# 최적화를 위한 변경사항

## 1. 요청크기 줄이기

### 1. 소스코드 줄이기

- minify, uglify를 위한 webpack.config.js 수정

  ```js
  //해당코드 삭제
  optimization: {
    minimize: false;
  }
  ```

  : 압축과 난독화는 자동으로 진행된다. 이를 막는 웹팩 설정 코드를 삭제해주었다.

  > Webpack은 v4 이상의 버전에서는 mode가 production일 때 자동으로 압축과 난독화를 진행한다. v5에서는 이 과정에서 사용되는 플러그인으로 teser-webpack-plugin을 내장하고 있다. Terser는 동시에 난독화까지 해준다. -[출처](https://medium.com/@uk960214/%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-1-%EB%B2%88%EB%93%A4-%ED%81%AC%EA%B8%B0-%EC%A4%84%EC%9D%B4%EA%B8%B0-react-webpack-minify-code-splitting-e2391e7e5f1b)-

- css

  : css 최적화는 하지 않았다. 스타일드 컴포넌트가 아니지만 하지 않았던 이유는 아래와 같다. 현재 `style-loader`가 적용되어있는데 이와 비교하는 것이 `MiniCssExtractPlugin`였다. 장단점을 비교했을 때 프로젝트가 어떤 성격인지가 중요한 부분이었는데, 현재 프로젝트는 페이지 이동이 거의 없고, 따라서 불필요한 css파일도 거의 없을 것이라고 생각했다. 그렇다면 두 방식의 장단점 모두 큰 작용을 하지 않을 것이라고 생각했고, 이런 상황에서 굳이 플러그인을 설치할 필요는 없다고 느꼈다.

  > 또한 CSS-in-JS는 babel 트랜스파일링 과정에서 최적화되기 때문에 CSS-in-CSS인 경우에만 압축화 난독화를 적용해주면 된다. [-출처-](https://velog.io/@thumb_hyeok/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0)

  > 번들을 나누지 않고 하나의 파일로 생성 한다거나, 페이지 간에 공유하는 스타일이 많은 경우에는 전자(style-loader)를, 코드 스플릿팅을 적용해 번들 파일이 여러 개이거나 페이지 별로 공유하고 있는 CSS의 크기가 크지 않다고 가정했을 때는 후자(MiniCssExtract)를 선택하는 것이 최선이라고 생각 [-출처-](https://medium.com/@uk960214/%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-1-%EB%B2%88%EB%93%A4-%ED%81%AC%EA%B8%B0-%EC%A4%84%EC%9D%B4%EA%B8%B0-react-webpack-minify-code-splitting-e2391e7e5f1b)

  > 만약 SPA라면, style-loader가 베스트일 것 같다. 왜냐하면, 모든 스타일들을 사용할 가능성이 많기 때문이다. [-출처-](https://velog.io/@hyorard-b/style-loaderMiniCssExtractPlugin)
