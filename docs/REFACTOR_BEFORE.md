## 개선 전 성능

### Network 탭 Fast 3g 설정에서의 성능

bundle.js 사이즈 : 285kB

hero.png: 10.7MB

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/8539bf99-8392-48b8-aefe-3744d6b629ae)

### 프랑스 파리에서 Fast 3G 환경으로 접속했을 때

https://www.webpagetest.org/result/230902_BiDcZ6_A4F/

#### 첫번째 Home 접속 시

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/7ab68828-e2b5-4bd1-b430-aace1b255a40)

페이지 불러오는 속도: 85.1초

First Contentful Paint: 2.8초

Largest Contentful Paint: 2.8초

Start Render: 2.8초

Page Weight: 15,582KB

#### 두번째 Home 접속 시

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/809d0bad-a18b-471d-9e52-0ef8292d73ab)

페이지 불러오는 속도: 84.8초

First Contentful Paint: 2.5초

Largest Contentful Paint: 2.5초

Start Render: 2.6초

Page Weight: 15,582KB

### LightHouse 점수

점수 : 75점

FCP 0.5초
LCP 9.2초

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/4fd147a1-9b97-4991-9d28-ce2b8d9c4842)

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/81f41ebf-5357-4694-8c6a-5a0d95c5cbbf)

### 퍼포먼스 탭 CPU 6x slowdown Network Fast 3G 환경

- Partially Presented Frame 이 많이 발생함

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/172520d7-54ac-45b9-8228-e554b38f45c0)

### 번들링되는 모듈

#### giphy 모듈이 포함되어 있음

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/312b99c1-9fdf-4ecf-8094-5ab7a14e4910)

#### react-icons 모듈의 크기: 628KB

![image](https://github.com/Gilpop8663/perf-basecamp/assets/80146176/df19e077-bea7-411a-bdc5-10bb7b6d3367)
