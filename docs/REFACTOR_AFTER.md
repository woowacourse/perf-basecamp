## 개선 후 성능

#### bundle.js 사이즈 (홈)

- react.bundle.js: 42.1 kB
- 113.bundle.js: 11.4 kB
- main.bundle.js 13.1 kB

<img width="1064" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/becde4ed-0575-4222-84aa-9560f88adba1">

#### bundle.js 사이즈 (검색)

- 891.chunk.bundle.js: 13.6 kB
- search.chunk.bundle.js: 4.7 kB

<img width="1440" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/6ba5b50b-0207-47fa-b5b6-209d282ffa9d">

총 번들 사이즈: 84.9 kB

### Network 탭 Fast 3g 설정에서의 성능(작은 화면)

md-hero.avif: 44.7 kB

<img width="1064" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/becde4ed-0575-4222-84aa-9560f88adba1">

### Network 탭 Fast 3g 설정에서의 성능(큰 화면)

lg-hero.avif: 71.2 kB

<img width="1332" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/ef8359d1-fb07-49f1-8bfe-4361e1223198">

### 프랑스 파리에서 Fast 3G 환경으로 접속했을 때

https://www.webpagetest.org/result/230907_AiDc8F_45N/

#### 첫번째 Home 접속 시

<img width="1431" alt="image" src="https://github.com/woowacourse/perf-basecamp/assets/80146176/ac450dcb-bda5-4528-9124-54a04e39fa89">

페이지 불러오는 속도: 2.6초

First Contentful Paint: 1.6초

Largest Contentful Paint: 2.2초

Start Render: 1.6초

Page Weight: 941KB

#### 두번째 Home 접속 시

<img width="1440" alt="image" src="https://github.com/woowacourse/perf-basecamp/assets/80146176/3e4494f0-ea5c-4e8d-a423-e0ffbc8f5881">

페이지 불러오는 속도: 2.6초

First Contentful Paint: 1.6초

Largest Contentful Paint: 2.2초

Start Render: 1.6초

Page Weight: 941KB

### LightHouse 점수

점수 : 100점

FCP 0.5초
LCP 0.5초

<img width="1037" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/0475f047-f87d-42a6-a915-f43c3dc4879b">

<img width="1036" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/cca7cdec-2a4e-4c3c-ace1-53f9b43c8133">

<img width="1043" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/70aa0263-902a-4a0e-9073-5d3a9b417c98">

### 퍼포먼스 탭 CPU 6x slowdown Network Fast 3G 환경

#### 홈 화면

- Partially Presented Frame 발생하지 않음

<img width="1440" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/6a2f38ba-fe40-47ec-b267-86f2dfb20998">

#### 검색 화면

- Partially Presented Frame 발생하지 않음

<img width="1440" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/35d84b4b-3e3f-4989-a05b-d560037ef5d8">

<img width="1293" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/def04c4e-03bb-49fb-84ef-c1c2dc2b258e">

### 번들링되는 모듈

#### 홈에서 불러오는 스크립트에 giphy 모듈이 포함되어 있지 않음

<img width="1436" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/8da1293a-efbf-4d37-81be-89eafeef3fec">

#### 번들에 포함된 react-icons 모듈의 크기: 0KB

<img width="1440" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/4648f903-5e42-4f68-bfe5-2635fb08f8c2">

<img width="1437" alt="image" src="https://github.com/Gilpop8663/perf-basecamp/assets/80146176/2ac6bddb-ca60-45d1-8e22-6dd2066e0454">
