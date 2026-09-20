# memegle 성능 개선 기록

접근 순서: 측정 -> 분석 -> 개선 -> 재측정

## 시작하기 전에

개선 작업에 들어가기 전, 개선 전 측정만 마친 시점에 적었다.

### 성능이 중요한가

memegle에 오는 사람은 짤 하나 찾으러 잠깐 들르는 사람이다. 목적이 가볍고 대체재가 많아서 기다려 줄 이유가 없다. 첫 화면이 안 뜨면 그냥 닫는다. 이 서비스에서 성능은 기능이 되느냐의 문제와 같다. 가설이긴하지만 검색 결과가 늦게 뜨는 것과 검색이 안 되는 것을 사용자는 구분하지 않는다고 본다. 다만 Nielsen Norman Group의 응답 시간 기준(1초를 넘으면 흐름이 끊기고 10초를 넘으면 주의를 잃는다)에 비추면 지금 첫 화면은 집중이 잘 되지 않는다.

다만 모든 성능이 똑같이 중요하지는 않다. 측정해 보니 로딩 중 스크립트가 무겁거나(TBT) 레이아웃이 밀리는(CLS) 문제는 없다. 여기서 중요한 건 두 가지다. 첫 화면이 뜨는 시간(LCP), 그리고 커서, 스크롤, hover 같은 인터랙션이 끊기지 않는 것.

### 개선해야 하는 이유

느린 것 같아서가 아니라 측정값이 예산을 벗어났기 때문이다. 수치는 아래 "개선 전 측정"과 "분석"에 한 번만 적고 여기서는 가리키기만 한다.

- LCP가 예산 밖이다. 히어로 이미지 하나가 첫 화면을 막고 있고, Lighthouse에서 빠진 점수 대부분이 여기서 나온다.
- Home 스크립트 크기가 예산 밖이다. 압축이 꺼져 있고 Search 코드까지 한 번들이다.
- 페이로드의 거의 전부가 이미지다.

반대로 개선하지 않을 것도 정한다. 로딩 시점의 TBT와 CLS는 예산 안이다. 폰트는 요구사항 밖이고 효과가 작아 일단 뒤로 미루기로 하였다.

### 성능 개선은 언제 하나

- 기능이 돌아가는 것이 우선이다. 다만 배포 전에 한 번은 재서 예산 안에 있는지 확인한다.
- 개선에 들어가는 조건은 측정값이 예산을 벗어났을 때다. 예산 안이면 손대지 않는다.
- 운영 중에는 기능이 늘 때마다 같은 환경에서 다시 잰다. 사용자 문의가 오면 그 환경(기기, 네트워크)을 재현해서 잰다.
- 감으로 느린 것 같다는 이유만으로는 하지 않는다. 잰 다음에 한다.

### "성능 개선 좀 해야 할 것 같은데요?"라는 말이 나오면

1. 어떤 화면의 어떤 동작이 느린지 좁힌다. 로딩인지 인터랙션인지부터 가른다.
2. 측정 환경을 고정한다. 같은 기기, 시크릿 창, 네트워크와 CPU 조건을 적어 둔다.
3. 잰다. 예산과 비교해서 벗어난 지표를 찾는다.
4. 원인을 본다. Lighthouse 진단, Network 워터폴, Performance 탭의 Main 트랙.
5. 문제에 맞는 해결책을 하나씩 적용하고 그때마다 다시 잰다. 한 번에 여러 개를 바꾸면 무엇이 효과였는지 알 수 없다.
6. 전/후 수치를 기록해서 공유한다.

## 성능 관리 대상

핵심 기능은 gif 검색이다. 그 전에 사용자가 처음 만나는 화면이 Home이다.

| 대상                                                 | 이유                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Home 첫 로드                                         | 서비스 진입 관문. 여기서 나가면 검색까지 오지 않는다             |
| Home 인터랙션 (커스텀 커서, 스크롤 애니메이션)       | 첫 화면에서 바로 겪는 움직임. 버벅이면 서비스 전체가 느려 보인다 |
| Search 인터랙션 (결과 hover, load more, 도움말 패널) | 핵심 기능을 쓰는 동안의 경험                                     |

기준 환경은 데스크탑이다. 사용자 쪽 이유가 먼저다. 짤은 대개 채팅이나 커뮤니티 글에 붙이려고 찾는데, 모바일에서는 키보드와 메신저에 gif 검색이 이미 들어 있어 따로 웹사이트를 열 이유가 적다. 그래서 검색 사이트를 직접 여는 사용자는 데스크탑 쪽이 많을 것으로 가정했다. memegle에는 실제 접속 데이터가 없어 이건 가정이고, 팀 프로젝트라면 애널리틱스의 기기 비율을 먼저 본다. 코드도 이 가정과 맞다. 커스텀 커서는 마우스 전용이고, 레이아웃이 65rem 고정 폭이며, 반응형 대응은 424px 미디어쿼리 하나뿐이다.

## 성능 예산

| 지표                             | 종류      | 예산                                                | 근거                                                                                                                                                                                                                                                                            |
| -------------------------------- | --------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home LCP 1차 로드                | 시간      | 2.5s 미만 (3G Fast 상당, 1.6Mbps / 150ms)                          | 사용자 경험 기준. web.dev Core Web Vitals의 LCP "good" 경계가 2.5s다. 이 문서의 다른 예산은 이 2.5s를 어떻게 나눠 쓸지에서 나온다                                                                                                                                               |
| Home LCP 2차 로드                | 시간      | 1.5s 미만 (3G Fast 상당, 1.6Mbps / 150ms)                          | 재방문은 캐시에서 읽어야 하므로 첫 방문보다 1초는 빨라야 캐시가 걸린 것이다                                                                                                                                                                                                     |
| Home 스크립트 전송 크기          | 정량      | 60 KB 미만                                          | Fast 3G는 약 1.6Mbps, 초당 200KB 정도다. 60KB면 스크립트 다운로드가 0.3s 안에 끝나서 LCP 예산 2.5s 중 스크립트 몫을 이 정도로 묶고 나머지를 히어로 이미지에 준다. 실제로 react + react-dom + react-router를 minify하고 gzip하면 약 54KB라 Home 코드를 더하면 이 근처가 바닥이다 |
| 히어로 이미지 크기               | 정량      | 120 KB 미만, 단 화질이 눈에 띄게 깨지지 않는 선에서 | 같은 계산으로 0.6s 분량. 스크립트 0.3s + 이미지 0.6s + 왕복 지연을 더해도 2.5s 안에 든다. 수치를 맞추려고 화질을 버리면 사용자 경험은 나빠지므로 원본과 1:1 배율로 나란히 놓고 비교해서 차이가 보이면 멈춘다                                                                    |
| Lighthouse Performance           | 규칙 기반 | 95 이상                                             | 도구 점수. 위 지표들이 예산 안이면 따라오는 결과라 목표라기보다 확인용이다                                                                                                                                                                                                      |
| Dropped Frame                    | 렌더링    | 0 (CPU 6x)                                          | 60fps 화면은 한 프레임에 16.7ms다. 한 번이라도 넘기면 눈에 끊김으로 보인다                                                                                                                                                                                                      |
| Partially Presented Frame        | 렌더링    | 최소 (CPU 6x)                                       | 위와 같은 기준. 완전 드랍보단 낫지만 버벅임으로 체감된다                                                                                                                                                                                                                        |
| load more 시 기존 GifItem 리렌더 | 렌더링    | 0                                                   | 이미 그려진 것을 다시 그리는 일은 사용자에게 아무것도 주지 않는다                                                                                                                                                                                                               |
| 애니메이션 중 Layout 횟수 | 렌더링 | 0 근처 (hover, 도움말 패널) | 요구사항 "Layout Shift 없이 애니메이션"의 측정 지표. transform과 opacity는 합성만 일으키지만 top, right 같은 속성은 매 프레임 레이아웃을 다시 계산한다. CLS 점수는 3px 미만 이동을 집계하지 않아 이 문제를 못 잡는다 |

수치 자체는 미션이 제시한 목표와 같다. 다만 60KB, 120KB 같은 숫자는 사용자 경험에서 나온 값이 아니라 "작업을 다 하면 남는 바닥"에 가까워서, 위 표에서는 LCP 2.5s에서 역산해 왜 그 근처인지를 적었다. 현재 값 대비 20% 개선 같은 기준은 LCP 10.7s처럼 예산과 거리가 먼 지표에는 의미가 없어 쓰지 않았다.

### 경쟁 제품 비교

memegle의 경쟁 제품은 같은 기능을 같은 사용자에게 주는 giphy.com이다. 같은 환경(Desktop, 시크릿 창, 2026-09-20)에서 홈을 쟀다.

|             | giphy.com 홈 | memegle 개선 전 | memegle 예산 |
| ----------- | ------------ | --------------- | ------------ |
| Performance | 37           | 75              | 95 이상      |
| LCP         | 13.3s        | 10.7s           | 2.5s 미만    |
| FCP         | 1.8s         | 0.7s            |              |
| TBT         | 0ms          | 0ms             |              |
| CLS         | 0.657        | 0.001           |              |
| Speed Index | 4.0s         | 0.9s            |              |

경쟁 제품이 개선 전 memegle보다 느리다. 홈이 gif 수십 개를 자동재생하는 피드라 LCP가 13초를 넘고, CLS 0.657은 하단 쿠키 배너와 피드가 나중에 끼어드는 것으로 보인다(스크린샷 기준 추정). 학습 자료의 "경쟁 제품 대비 20% 개선" 기준으로 예산을 잡았다면 LCP 10초 근처가 목표가 됐을 텐데, 그건 사용자가 주의를 잃는 선(10초) 밖이라 목표로 쓸 수 없다. 이 경우엔 경쟁 제품보다 일반 가이드라인(LCP 2.5s)이 맞는 기준이고, 이 문서의 예산은 그쪽을 따랐다. 개선이 끝나면 경쟁 제품과의 차이가 사용자에게 memegle을 쓸 이유가 된다.

### 참고 사례

기능은 다르지만 실제 제품이 예산 근처 점수를 내는지 보려고 당근 홈도 같은 환경에서 쟀다.

|                                     | 당근 홈 (daangn.com/kr)                                                  | memegle 개선 전                    |
| ----------------------------------- | ------------------------------------------------------------------------ | ---------------------------------- |
| Performance                         | 94                                                                       | 75                                 |
| LCP                                 | 1.5s                                                                     | 10.7s                              |
| FCP                                 | 0.7s                                                                     | 0.7s                               |
| TBT / CLS                           | 0ms / 0                                                                  | 0ms / 0.001                        |
| 1st party 전송 합계 (JS, CSS, 폰트) | 약 1,105 KiB, 파일 수십 개, 필요할 때 나눠 받음                          | 311 KiB, 파일 하나, 전부 먼저 받음 |
| 이미지                              | 640x640으로 크롭한 jpeg/webp, 품질 82. 이미지 서버가 URL 파라미터로 생성 | 4100x2735 PNG 원본 그대로          |
| 정적 파일명                         | 전부 해시 포함 (`GlobalNav-BirMxpmS.js`)                                 | 해시 없음 (`bundle.js`)            |
| 캐시 TTL                            | 1일                                                                      | 10분 (GitHub Pages 기본값)         |

실제 상품 데이터, 지도, 폰트까지 실은 제품이 스크립트 총량 3배로도 94점이다. 점수는 총량이 아니라 첫 화면을 무엇이 막고 있느냐에 달렸다. 서버에서 HTML을 그려 보내면 스크립트가 도착하기 전에 첫 그림이 나오고, LCP 이미지가 표시 크기에 맞춰져 있으면 다운로드가 짧다. 페이지 2개에 서드파티가 없는 memegle에서 95는 무리한 목표가 아니다.

비교에서 확인한 설계 근거:

- 이미지는 표시 크기에 맞춰 리사이즈하고 품질 80 근처의 webp로 만든다. 표시 크기보다 큰 픽셀은 화면에 나타나지 않으면서 다운로드 시간만 늘리고, 사진류는 품질 80 근처까지 육안 차이가 거의 없는 채로 크기가 크게 줄기 때문이다. 이미지 서버가 없으니 빌드 시점에 만든다.
- 스크립트는 역할 단위로 쪼개고 파일명에 내용 해시를 붙인다. 내용이 바뀌면 이름이 바뀌므로 오래 캐시해도 낡은 파일을 쓸 일이 없고, 첫 화면에 필요 없는 조각은 나중에 받을 수 있기 때문이다.
- Lighthouse 진단은 힌트다. 해시 붙은 파일에 캐시 1일을 두는 선택에도 빨간 표시가 나온다. 진단을 전부 지우는 게 목표가 아니라 예산 안에 드는 게 목표다.
- 폰트 서브셋은 요구사항 밖이라 기록만 해 둔다.

토스증권 홈은 72점(LCP 4.7s)이었으나 시크릿 창이 아닌 상태에서 잰 것(IndexedDB 경고)이라 재측정 전까지 비교에 쓰지 않는다.

## 측정 환경

같은 환경에서 개선 전/후를 비교한다.

| 항목             | 값                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 측정일           | 2026-09-19                                                                                                                                                                               |
| 브라우저         | Chrome 시크릿 창(Chromium 153), 확장 프로그램 없음                                                                                                                                       |
| Lighthouse       | DevTools > Lighthouse 13.4.1 > Navigation, Desktop. throttling은 패널 기본 설정 그대로 (리포트 하단 표기: Custom throttling). 첫 실행은 4개 카테고리, 이후 Performance만 3회 돌려 중간값 |
| 네트워크         | DevTools는 Slow 4G 프리셋(구 Fast 3G, 1.6Mbps / 750Kbps / 150ms). 프레임 녹화는 로드 후 시작하므로 네트워크 조건이 결과에 영향을 주지 않는다. WebPageTest는 무료 플랜이 Europe 리전 1회, First View만 제공해 보조 자료로만 쓴다                                                                                   |
| CPU              | 6x slowdown (Performance 탭). 녹화는 페이지 로드가 끝난 뒤 시작                                                                                                                          |
| 프레임 측정 절차 | Home: 커서 3~4초 휘젓기 후 맨 아래까지 스크롤. Search: gif 4~5개 hover 후 도움말 패널 열고 닫기 2회                                                                                      |
| 리렌더 측정      | 로컬 개발 서버(npm run serve)에서 React DevTools Profiler로 load more 1회                                                                                                                |
| LCP 1차/2차 | DevTools Performance 트레이스(Slow 4G, CPU 1x, 뷰포트 1024x681). 1차는 캐시 없는 새 브라우저 컨텍스트, 2차는 같은 컨텍스트에서 10분 이내 재로드. LCP 값은 페이지의 PerformanceObserver(largest-contentful-paint) 마지막 항목 |
| 개선 전 배포     | https://lee-eojin.github.io/perf-basecamp                                                                                                                                                |
| 개선 후 배포     | (CloudFront 주소)                                                                                                                                                                        |

## 개선 전 측정

### 빌드 산출물 (npm run build:prod)

| 파일          | 크기     | gzip    |
| ------------- | -------- | ------- |
| bundle.js     | 1.18 MiB | 306 KiB |
| bundle.js.map | 1.39 MiB |         |
| hero.png      | 10.2 MiB |         |
| find.gif      | 1.89 MiB |         |
| free.gif      | 1.61 MiB |         |
| trending.gif  | 1.2 MiB  |         |
| 합계          | 16.1 MiB |         |

### 지표

| 지표                               | 목표        | 개선 전        | 개선 후 |
| ---------------------------------- | ----------- | -------------- | ------- |
| Lighthouse Performance             | 95 이상     | 75             |         |
| Home 스크립트 전송 크기            | 60 KB 미만  | 311 KiB (gzip) |         |
| 히어로 이미지 크기                 | 120 KB 미만 | 10,428 KiB     |         |
| Home LCP 1차 로드 (3G Fast 상당)   | 2.5s 미만   | 90.7s (DevTools, Slow 4G, 캐시 없음, LCP 요소 hero.png). WebPageTest는 30초 한도로 텍스트 3.2s만 기록 |         |
| Home LCP 2차 로드 (3G Fast 상당)   | 1.5s 미만   | 0.23s (DevTools, Slow 4G, 10분 이내 재방문이라 전부 캐시) |         |
| Dropped Frame                      | 없음        | Home 28 / Search 3 |         |
| Partially Presented Frame          | 최소        | Home 302 (24%) / Search 30 (3%) |         |
| load more 시 기존 GifItem 리렌더   | 없음        | 16/16 전부 리렌더 (같은 커밋에서 ArtistInfo 100개도) |         |
| hover, 패널 애니메이션 중 Layout 횟수 | 0 근처      | 패널 열기/닫기 0.5s 동안 각 23 / 22회, hover 중 초당 2~5회 |         |

### Lighthouse (Home, Desktop, 2026-09-19 17:07)

| 카테고리       | 점수 |
| -------------- | ---- |
| Performance    | 75   |
| Accessibility  | 83   |
| Best Practices | 96   |
| SEO            | 82   |

| 메트릭      | 값                         |
| ----------- | -------------------------- |
| FCP         | 0.7s                       |
| LCP         | 10.7s (LCP 요소: hero.png) |
| TBT         | 0ms                        |
| CLS         | 0.001                      |
| Speed Index | 0.9s                       |

Lighthouse가 지목한 항목과 절감 가능치:

| 항목                            | 절감 가능치 | 내용                                                                                                                                                               |
| ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Improve image delivery          | 14,010 KiB  | hero.png 10,422 KiB: 원본 4100x2735인데 표시 크기는 1374x1376 (8,665 KiB), WebP/AVIF로 바꾸면 8,597 KiB 절감. gif 3개는 비디오 포맷 권장 (1,609 + 1,339 + 947 KiB) |
| Use efficient cache lifetimes   | 14,268 KiB  | 모든 정적 리소스 TTL 10분 (GitHub Pages 기본 max-age=600)                                                                                                          |
| Reduce unused JavaScript        | 167 KiB     | react-icons/ai/index.esm.js 113.2 KiB 중 112.9 KiB 미사용, @remix-run/router 34.3 중 29.2 미사용, react-dom 22.8 중 10.1 미사용                                    |
| Minify JavaScript               | 31 KiB      | bundle.js 미압축                                                                                                                                                   |
| Render-blocking requests        | 300ms       | Google Fonts CSS                                                                                                                                                   |
| LCP request discovery           |             | hero.png에 fetchpriority=high 권장                                                                                                                                 |
| Network dependency tree         | 619ms       | index.html -> fonts.googleapis.com CSS -> fonts.gstatic.com woff2 2개 체인                                                                                         |
| Avoid enormous network payloads | 15,626 KiB  | hero.png 10,428 / find.gif 1,941 / free.gif 1,655 / trending.gif 1,231 / bundle.js 311 / 폰트 59                                                                   |
| 그 외                           |             | bundle.js.map이 함께 배포됨. img alt 누락 3개(Accessibility). meta description 없음(SEO)                                                                           |

전체 페이로드 15.6 MiB 중 이미지가 15.2 MiB (97%).

### WebPageTest (Home, 3G Fast, 2026-09-20, 1회 실행, Milan)

결과: https://www.webpagetest.org/result/260920_instant_3b5baa582f364933b3043677891784d0/

간단 모드로 돌려서 위치가 Paris가 아니라 Milan으로 잡혔다. Paris, 3회, Repeat View로 재측정하기 전까지의 임시 값이다.

| 항목 | First View |
|---|---|
| TTFB | 812ms (DNS 164ms + 연결 156ms + TLS 212ms를 거쳐 요청 시작이 533ms) |
| FCP / LCP | 3.2s / 3.2s |
| Speed Index | 11.1s |
| CLS / TBT | 0.001 / 0ms |
| bundle.js | 318KB, 0.8s 시작, 3.0s 완료 |
| Google Fonts CSS | 렌더 차단, 1.0s (다른 origin이라 DNS, 연결, TLS에 0.6s) |
| hero.png | 3.0s 시작, 테스트 한도 30s까지 10.6MB 중 2.4MB 수신 |

LCP 요소가 히어로 이미지가 아니라 부제목 텍스트다. 이미지가 30초 안에 도착하지 못해 텍스트가 LCP로 남았다. 3G Fast(1.6Mbps, 초당 약 200KB)에서 10.6MB는 계산상 53초라, 이미지가 끝까지 왔다면 LCP는 50초대다. 3.2s라는 숫자를 예산 안으로 읽으면 안 된다.

Paris 위치, Repeat View, 3회 중간값으로 재측정한다.

### LCP 1차/2차 로드 (DevTools Performance, Slow 4G, 2026-09-20)

WebPageTest 무료 플랜이 Repeat View를 주지 않아 DevTools로 같은 조건을 만들어 쟀다. Slow 4G 프리셋은 3G Fast와 같은 1.6Mbps / 150ms다.

| | 1차 (캐시 없음) | 2차 (10분 이내 재로드) |
|---|---|---|
| LCP | 90.7s | 0.23s |
| LCP 요소 | hero.png (1024x625 표시 영역) | 캐시된 요소 |
| TTFB | 41ms | 0.5ms (HTML도 캐시) |

1차 로드에서 hero.png(10.6MB)가 gif 3개(4.8MB)와 대역폭을 나눠 쓰며 내려와 90초 뒤에야 LCP 요소가 된다. 텍스트 부제목이 3.0s에 먼저 LCP 후보가 되지만 이미지가 도착하면 밀려난다. WebPageTest가 3.2s로 보고한 건 30초 한도 안에 이미지가 못 와서 텍스트 값이 남은 것이다.

2차 로드 0.23s는 GitHub Pages가 모든 파일에 `max-age=600`을 주기 때문이다. 10분이 지나면 파일마다 서버에 재검증(304)을 다녀와야 해서 RTT 150ms 단위로 다시 느려진다. 파일명에 해시를 붙여 장기 캐시를 거는 것이 3단계의 목적이다.

원본: `measurements-raw/before/devtools-lcp-first-slow4g-full.json.gz`, `devtools-lcp-repeat-slow4g.json.gz`

### 프레임 (Home, CPU 6x, 2026-09-20)

로드가 끝난 뒤 12.3초 녹화 (네트워크 프리셋은 Fast 4G였으나 로드 후 녹화라 프레임 결과와 무관). 커서 3~4초 휘젓기, 맨 아래까지 스크롤, 다시 커서 휘젓기. 프레임 상태는 트레이스의 PipelineReporter 이벤트로 셌다.

| 상태 | 개수 |
|---|---|
| 정상 표시 | 932 |
| Partially Presented | 302 |
| Dropped | 28 |

Dropped 28개 중 24개가 커서를 휘젓던 두 구간(4초, 10~11초, mousemove 초당 30회)에 몰려 있다. 스크롤 구간은 Dropped가 거의 없고 Partial만 있다. Layout은 91회 32ms로 작아서 레이아웃 자체보다 mousemove마다 도는 React 렌더가 6x CPU에서 한 프레임 16.7ms를 넘기는 쪽이 의심된다. 개선 단계에서 Main 트랙으로 확인한다.

원본: `measurements-raw/before/trace-home-1.json.gz`

### 프레임 (Search, CPU 6x, 2026-09-20)

trending gif가 다 뜬 뒤 15.1초 녹화. gif 카드 hover 훑기, 도움말 패널 열기/닫기 2회.

| 상태 | 개수 |
|---|---|
| 정상 표시 | 906 |
| Partially Presented | 30 |
| Dropped | 3 |

Partial 30개 중 23개가 hover를 빠르게 훑던 구간(8개)과 패널이 열리던 구간(15개)에 있다. Layout 이벤트가 패널 열림/닫힘 transition 0.5초 동안 각각 23회, 22회 찍힌다. `right`를 애니메이션해서 매 프레임 레이아웃을 다시 계산하기 때문이다. hover 구간도 `top` transition 때문에 초당 2~5회 Layout이 있다.

트레이스에 LayoutShift 이벤트는 0이다. Chrome이 3px 미만 이동은 집계하지 않는데, hover는 12px를 0.2초에 나눠 움직여 프레임당 1px 근처라 잡히지 않는다. 그래서 이 항목은 CLS 점수가 아니라 애니메이션 중 Layout 횟수로 전/후를 비교한다. transform으로 바꾸면 0 근처가 되어야 한다.

원본: `measurements-raw/before/trace-search-1.json.gz`

### 리렌더 (Search load more, 2026-09-20)

로컬 개발 서버(npm run serve)에서 "cat" 검색 후 load more 1회. React DevTools Profiler 기준(그 커밋에서 컴포넌트 함수가 실행됐는지)으로 마지막 커밋을 셌다. 렌더되면 안 되는 NavBar, Footer, App이 0으로 나오는 것으로 기준을 확인했다.

| 컴포넌트 | load more 커밋에서 렌더 |
|---|---|
| GifItem 기존 16개 | 16/16 |
| GifItem 새 16개 | 16/16 |
| ArtistInfo (닫힌 도움말 패널 안) | 100/100 |
| Search, SearchResult, SearchBar, ResultTitle, HelpPanel, ArtistList | 각 1/1 |
| NavBar, Footer, App | 0 |

기존 GifItem의 props는 매 렌더마다 새 객체지만 값(imageUrl, title)은 같다. memo의 얕은 비교로 걸러질 조건이다. Search 상태가 바뀔 때마다 닫혀 있는 도움말 패널의 아티스트 100개도 함께 렌더된다.

원본: `measurements-raw/before/rerender-check-result.json`

## 분석

예산을 벗어난 지점과 원인:

- LCP 10.7s (Lighthouse 시뮬레이션), 실측 90.7s (DevTools Slow 4G, 목표 2.5s): LCP 요소가 hero.png인데 10 MiB짜리 PNG를 표시 크기의 3배 해상도로 내려받는다. 이미지 하나가 LCP를 결정한다.
- 스크립트 311 KiB (목표 60 KB): `minimize: false`라 압축이 안 되고, terser가 안 돌아서 webpack이 미사용으로 표시한 react-icons/ai 전체(113 KiB)가 제거되지 않는다. Home에 Search 코드까지 한 번들이다.
- 캐시: 파일명에 해시가 없어 장기 캐시를 걸 수 없고, GitHub Pages 기본값 10분에 묶여 있다.
- TBT 0ms, CLS 0.001: 로딩 단계에선 스크립트 실행량과 레이아웃 이동이 문제가 아니다. 렌더링 문제(커서, 스크롤, hover)는 Lighthouse가 아니라 Performance 탭에서 봐야 한다.
- 프레임 (목표 Dropped 0): Home에서 12초 동안 Dropped 28, Partial 302(24%). Dropped는 커서를 움직이는 구간에 몰려 있다. CustomCursor가 mousemove마다 setState로 리렌더하고 `top/left`를 바꾸는 구조라, 6x CPU에서 프레임 예산 16.7ms를 넘긴다. 스크롤 쪽은 AnimatedPath가 scroll마다 setState와 `getTotalLength()`를 반복한다.
- Search 애니메이션: 프레임 자체는 Dropped 3, Partial 30으로 양호하지만, 패널 열기/닫기 0.5초 동안 Layout이 22~23회 돈다. `right`와 `top`을 transition하는 구조라 매 프레임 레이아웃이 다시 계산된다. GifItem hover(`top`), HelpPanel(`right`) 둘 다 `transition: all`이다.
- 리렌더 (목표 0): load more 한 번에 기존 GifItem 16개가 전부 다시 렌더된다. GifItem에 memo가 없고, SearchResult가 gifList 변경으로 렌더되면서 값은 같은 새 props 객체를 넘기기 때문이다. 같은 커밋에서 닫혀 있는 HelpPanel의 ArtistInfo 100개도 렌더된다.

## 개선 작업

### 1 요청 크기 줄이기

### 2 필요한 것만 요청하기

### 3 같은 건 매번 새로 요청하지 않기

### 4 최소한의 변경만 일으키기

## 개선 후 측정

(개선 전과 같은 환경에서 재측정)
