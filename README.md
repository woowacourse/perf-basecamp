# 🚀 프론트엔드 성능 베이스캠프

## 성능 오답노트 : memegle 프로젝트 성능 개선하기

## 📕 미션 소개

프론트엔드 성능 베이스캠프에 오신 여러분 환영합니다! 🤗

이번 미션에서는 예제로 구성한 짤 검색 사이트, 'Memegle' 프로젝트의 성능을 개선해볼거에요.

<img width=400 src="https://user-images.githubusercontent.com/81607552/129674696-2fe7251b-90fe-4dec-8bc5-5d47bcc9159c.png"> <img width=370 src="https://user-images.githubusercontent.com/81607552/129674723-03d93732-1aba-42ca-a7cf-d2abe1005847.png">

Memegle 프로젝트는 곳곳에 성능을 저하시키는 요소들로 가득한데요.  
여기저기 구멍난 곳들을 고쳐서, 기본적인 수준으로 쓰는 데에 불편함이 없는 버전 1.0.0을 만들어주세요.

(엉망진창 성능의) 배포된 샘플 프로젝트는 [여기](http://frontend-performance-basecamp.s3-website.ap-northeast-2.amazonaws.com)에서 확인할 수 있습니다.

## ✅ 미션을 시작하기 전에...

몇 가지 계정 생성이 필요합니다.

- gif 검색을 위해 GIPHY API 를 사용하고 있습니다.  
  GIPHY API 키 발급을 위해 [GIPHY](https://developers.giphy.com/)에서 가입 후 앱 생성 > API 키 발급이 필요합니다.

  - 발급한 키는 루트 경로에 `.env`파일을 만들어 GIPHY_API_KEY 값으로 설정해주세요

  ```xml
  // .env
  GIPHY_API_KEY={발급받은 API KEY}
  ```

- 우테코 AWS 개인 계정에서 진행합니다.

## 📅 **진행 방식**

- 이번 미션은 개인 미션입니다. 페어는 리뷰 진행을 위해 매칭합니다.
- 예제 프로젝트를 fork 받아 각자 개선 작업을 진행하신 뒤, PR을 보내주세요.
- PR 제출시, PR 템플릿에 있는 항목들을 확인하고 채워주세요.
- 페어가 제출한 PR을 상호리뷰해주세요.

## **🎯 요구사항**

### 개선 목표

아래 작업 목록을 다 완료했을 경우 달성할 수 있을 것으로 예상되는 로딩 성능 관련 수치입니다.  
측정 환경에 따라 조금씩 다를 수도 있으니, 참고 기준으로만 삼아주세요  
이 수치를 완벽히 맞추기 위한 미션이 아니라, 개선 방법들을 한번씩 직접 경험해보기 위한 미션이랍니다. 🙂

- Lighthouse `95점` 이상
- Home 페이지에서 불러오는 스크립트 리소스 크기 `< 60kb`
- 히어로 이미지 크기 `< 120kb`
- `프랑스 파리`에서 `Fast 3G` 환경으로 접속했을 때
  - Home 첫 번째 로드시 LCP `< 2.5s`
  - Home 두 번째 이후 로드시 LCP `< 1.5s`

## 🔥 개선 전후 성능 측정 결과

- 배포한 CloudFront 접근 경로: https://d2afii7we5mzk9.cloudfront.net/

---

#### Lighthouse `95점` 이상

- 개선 전 (S3)

![lighthouse 개선 전](https://user-images.githubusercontent.com/40762111/131253686-e3b7d4b0-5b87-4e1a-b057-5984e339030c.png)

- 개선 후 (CloudFront)

![lighthouse 개선 후](https://user-images.githubusercontent.com/40762111/131497720-ff387f58-ef47-489f-b14b-e5643764ec80.png)

#### Home 페이지에서 불러오는 스크립트 리소스 크기 `< 60kb`

- 개선 전 (S3) - **799.6**KB (797 + 1.3 + 1.3)

![(리소스) 1  개선 전](https://user-images.githubusercontent.com/40762111/131258538-4517a0d3-9776-42aa-8fe1-ed7e03011927.png)

- 개선 후 (CloudFront) - **54**KB (50 + 1.4 + 1.3 + 1.3)

![(리소스) 5  개선 최종](https://user-images.githubusercontent.com/40762111/131497385-d53df761-35ff-477e-b16e-419da08baf76.png)

#### 히어로 이미지 크기 `< 120kb`

- 개선 전 - **10.7**MB

  ![hero 개선 전](https://user-images.githubusercontent.com/40762111/131253924-6bd94ef2-0ef3-4f90-80cd-1260ab662e05.png)

- 개선 후 - **119**KB

  ![hero 개선 후](https://user-images.githubusercontent.com/40762111/131264769-c7fcd797-1cd9-42c5-939a-881d4232b884.png)

#### `프랑스 파리`에서 `Fast 3G`환경으로 접속했을 때

- 조건

  - Home 첫 번째 로드시 LCP `< 2.5s`
  - Home 두 번째 이후 로드시 LCP `< 1.5s`

- 개선 전

<img width="1116" alt="LCP 개선 전" src="https://user-images.githubusercontent.com/40762111/131500003-d63126ae-d895-4c88-afe8-3c95fa44d6e6.png">

- 개선 후

<img width="1116" alt="LCP 개선 후" src="https://user-images.githubusercontent.com/40762111/131499707-28a79595-d777-45ad-815d-6ee1a50f11c4.png">

## ✅ 개선 작업 목록

**1 요청 크기 줄이기**

- 소스코드 크기 줄이기

  - [TerserPlugin](https://github.com/webpack-contrib/terser-webpack-plugin)

    ![공식 문서 optimization](https://user-images.githubusercontent.com/40762111/131256051-e114f482-0664-4724-8c3e-b65d12517942.png)

    - 공식 문서를 통해 알게 되었다. `TerserPlugin`은 기본적으로 [terser](https://github.com/terser/terser) 패키지를 사용하여 [옵션](https://github.com/terser/terser#compress-options)에 따라서 파일을 압축한다. webpack5 부터는 내장되어 바로 사용할 수 있다.

      ![(리소스) 2  1차 개선 후](https://user-images.githubusercontent.com/40762111/131262547-b46b5c89-9091-48cf-9cce-1282e875ab9c.png)

    - 799.6KB -> **81.8KB** (79.2 + 1.3 + 1.3)

  - [HTMLWebpackPlugin ](https://github.com/jantimon/html-webpack-plugin) (결과적으로 적용하지 않았다)

    - 여러 자료들([크리스가 공유한 글](https://codingmoondoll.tistory.com/entry/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-2-%EC%9B%B9%ED%8C%A9%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%B2%88%EB%93%A4-%EC%82%AC%EC%9D%B4%EC%A6%88-%EC%B6%95%EC%86%8C), [김정환님 글1](https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html#63-htmlwebpackplugin), [글2](https://jeonghwan-kim.github.io/series/2020/01/02/frontend-dev-env-webpack-intermediate.html))을 읽고 적용했다.

      <img width="265" alt="(리소스) 3  2차 개선 과정 옵션" src="https://user-images.githubusercontent.com/40762111/131259730-5d8c25c7-19d3-4fc0-8eea-69fe3957e911.png">

    - 옵션은 빈칸 제거, 주석 제거, hash(새로운 파일이 업로드되는 경우 캐쉬되어 있는 기존의 파일을 대체하는 `cache busting` 에 도움이 되는 옵션)
    - Html 파일에 빈칸과 주석이 차지하는 부분이 적어 소스 코드 크기에 변화가 없었다.
    - 81.8KB -> **81.8KB**

  - [MiniCssExtractiPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

    - 여러 자료들([크리스가 공유한 글](https://codingmoondoll.tistory.com/entry/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-2-%EC%9B%B9%ED%8C%A9%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%B2%88%EB%93%A4-%EC%82%AC%EC%9D%B4%EC%A6%88-%EC%B6%95%EC%86%8C), [김정환님 글1](https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html#63-htmlwebpackplugin), [글2](https://jeonghwan-kim.github.io/series/2020/01/02/frontend-dev-env-webpack-intermediate.html))을 읽고 적용했다.
    - 이 플러그인은 CSS를 별도의 파일들로 만든다. 브라우저 기준으로 번들 결과에 스타일시트 코드가 합쳐진 큰 파일 하나를 내려받는 것보다, 여러 개의 작은 파일들을 동시에 다운로드 하는 게 더 빠르다.

    ![(리소스) 4  2차 개선 후](https://user-images.githubusercontent.com/40762111/131263373-2486c112-386a-4f8b-9f2c-3f919066e0b6.png)

    - 81.8KB -> **76.3KB** (73.7 + 1.3 + 1.3)

  - CloudFront

    - 자동으로 압축해주는 기능을 사용했다. (gzip)

    ![(리소스) 5  개선 최종](https://user-images.githubusercontent.com/40762111/131497385-d53df761-35ff-477e-b16e-419da08baf76.png)

    - 76.3KB -> **54KB** (50 + 1.4 + 1.3 + 1.3)

- 이미지 크기 줄이기
  - PNG -> WebP
    - Hero image와 같이 큰 사이즈의 이미지는 PNG보다 JPG가 더 적합하다. [참조](https://www.bluearcher.com/blog-item-jpg-vs-png-for-web)
    - JPG와 WebP를 비교했을 때, 1500px이 넘어가는 경우 특별한 차이가 없지만, WebP 파일을 처음 알게 되어 사용해보고 싶었다. [참조](https://siipo.la/blog/is-webp-really-better-than-jpeg)
    - https://squoosh.app/ 사이트 이용.
    - 16:9의 비율을 표준으로 사용하면서 5:4의 비율까지 수용하여 범용으로 개발할 수 있는 해상도 1600 x 900으로 변환. [참조](https://www.samsungsds.com/kr/insights/enterprise_ux_resolution.html)
    - 10.7MB -> **119KB**
  - GIF -> MP4
    - GIF는 MP4에 비해서 용량이 크고, GIF 자체가 애니메이션 format보다는 이미지들을 하나의 파일에 모아놓기 위해 설계되었다. [참조](https://rigor.com/blog/optimizing-animated-gifs-with-html5-video/)
    - WebM은 MP4에 비해서 파일의 용량이 더 작지만, MP4가 품질과 호환성에서 더 우세해서 MP4 선택. [참조](https://www.winxdvd.com/answers/webm-vs-mp4.htm)
    - https://convertio.co/kr/gif-mp4/ 사이트 이용.
    - `find.gif` 2MB -> **947KB** / `trending.gif` 1.3MB -> **379KB**

**2 필요한 것만 요청하기**

- 페이지별 리소스 분리
  - `React.lazy`의 `Route-base code splitting`을 사용해서 구현. [참조](https://ko.reactjs.org/docs/code-splitting.html#route-based-code-splitting)

**3 같은 건 매번 새로 요청하지 않기**

- 캐시 설정

  - CloudFront 캐시 정책을 적용했다.

  ![3  같은 건 매번 새로 요청하지 않기 - CloudFront 캐시 설정](https://user-images.githubusercontent.com/40762111/131422550-a98b741c-e75c-4fc3-909b-ef3545ac7086.png)

  - S3 객체 파일에 메타데이터를 추가했다.

    ![3  같은 건 매번 새로 요청하지 않기 - S3 메타데이터 설정](https://user-images.githubusercontent.com/40762111/131427933-2714c3b9-29d8-4a06-a6ed-8762172f156a.png)

- GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.

  - 새로운 페이지 탭에서 검색하는 상황을 고려하여 `localStorage`를 사용했고, 트랜딩이라는 요소를 반영하기 위해서 `localStorage`에 저장된 데이터의 유효 기간을 1일로 설정했다. [관련 커밋](https://github.com/woowacourse/perf-basecamp/pull/25/commits/432537bc6bb3daedb1d1653c98dc33f0ed07c80a)

**4 최소한의 변경만 일으키기**

- 검색 결과 > 추가 로드시 추가된 목록만 렌더되어야 한다.
  - `React.memo` 사용. [관련 커밋](https://github.com/jum0/perf-basecamp/commit/28d527461ad91c2cbc10f1ad683440ebb2b43865)
- LayoutShift 없이 hover 애니메이션이 일어나야 한다.
  - hover 속성 변경 (`top` -> `transform`). [관련 커밋](https://github.com/woowacourse/perf-basecamp/pull/25/commits/65d20b6c07286d14c95ff3ebcb5d029365151673)

## 🧐 공유

- 전반적으로 많은 내용들이 처음이라 학습하면서 진행했는데, 꽤 재밌었다.
- 소스 크기를 줄이는 데 도움이 되는 여러 플러그인이 있었는데, 항상 다 도움이 되는 것은 아니었다. 현재 프로젝트의 소스에 따라서 불필요한 플러그인이 될 수도 있다는 것을 알게 되었다.
- 에셋 파일의 확장자를 변환할 때, 구글이 만든 `WebP`와 `WebM`이 있다는 것을 처음 알게 되었는데, 그 중에서 `WebM`은 사용하지 않았다. 더 적은 용량 등 강점이 있었지만, 품질 부분에서 `Mp4`에 밀린다고 한다. 용량과 품질을 비교했을 때, 좀 더 객관적인 기준이 있는 것은 용량이지만, 개인적으로 품질을 선택하고 싶었다. 품질을 측정해서 비교해보면 좋을 것 같다.
- 캐시 부분에 좀 더 이해가 필요하다고 느꼈다.
- API를 새로 요청하지 않는 방법으로 `localStorage`를 사용했는데, 메모리에 저장하는 방법과 비교했을 때 어떤 차이가 있을까.
