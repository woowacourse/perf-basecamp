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

### 0 React 19 업그레이드 (요구사항 밖)

성능 개선 수단이 아니라 학습 목적의 선택이다. `use()`로 Suspense 기반 데이터 로딩을 실험해 보려고 필수 작업에 들어가기 전에 단독으로 올리고, 영향을 따로 쟀다.

| 항목 | 전 | 후 |
|---|---|---|
| react, react-dom | 18.3.1 | 19.3.0 |
| @types/react, @types/react-dom | 18.3.x | 19.3.0 |
| typescript | 4.9.5 | 5.9.3 (React 19 타입이 5.6 이상을 요구) |
| 코드 변경 | | `AnimatedPath`의 ref prop 타입을 `RefObject<HTMLElement \| null>`로, null 가드한 지역변수 사용 |
| bundle.js (minify 전) | 1.18 MiB / gzip 306 KiB | 1.67 MiB / gzip 378 KiB |

번들이 커진 이유는 React 19가 minify되지 않은 production 파일(`react-dom-client.production.js` 625KB)을 배포하고 번들러가 압축하도록 맡기기 때문이다. 지금은 `minimize: false`라 그대로 실리고, 1단계에서 minify를 켜면 차이가 줄어든다. Home, Search, 검색, load more, 도움말 패널 동작을 확인했고 콘솔 에러는 없다.

### 1 요청 크기 줄이기

#### 1-1 minify 켜기

`optimization.minimize: true` 한 줄. webpack 5 production 모드의 기본값인데 이 저장소는 일부러 꺼 두고 있었다.

| | 전 | 후 |
|---|---|---|
| bundle.js | 1.67 MiB / gzip 378 KiB | 301 KiB / gzip 91 KiB |
| react-icons | `react-icons/ai` 세트 전체 포함 | 사용하는 아이콘 3개만 남음 |

react-icons 트리쉐이킹(2번 축의 요구사항)이 여기서 같이 해결됐다. webpack은 미사용 export를 표시만 하고 실제 제거는 terser가 하기 때문에, minify가 꺼져 있으면 표시된 코드가 그대로 남는다. 별도 조치 없이 이 항목이 충족된 이유다.

#### 1-2 프로덕션 소스맵 제거

webpack 설정을 `(env, argv) => 설정` 함수로 바꾸고 `argv.mode === 'production'`으로 환경을 판단해, `devtool`을 production에서 끄고 development에서는 `source-map`으로 두었다. 처음엔 `process.env.NODE_ENV`로 판단했는데, 그 값은 npm 스크립트의 `--node-env` 플래그가 넣어주는 것이라 플래그 없이 `--mode=production`만 실행하면 조용히 개발 설정으로 빌드된다. mode는 webpack이 직접 넘겨주므로 그런 틈이 없다. 개발 서버는 소스맵을 유지한다. 배포물에서 bundle.js.map(1.4MB)이 빠졌고 bundle.js도 281 KiB로 줄었다(매핑 주석 제거). 브라우저는 DevTools를 열지 않는 한 소스맵을 받지 않아 로딩 지표에는 영향이 없지만, 배포물에 원본 코드를 싣지 않는 것이 맞다.

#### 1-3 히어로 이미지: PNG 10.6MB -> WebP 115KB

원본은 4100x2735 PNG, 알파 채널이 있지만 전부 불투명이다. 표시 폭은 데스크탑에서 최대 1920px이다.

| 후보 | 크기 |
|---|---|
| WebP 1920px q70 | 163 KB |
| WebP 1440px q75 | 115 KB |
| AVIF 1920px q55 | 78 KB |

원본과 후보를 1:1 배율로 같은 영역(640x400)을 잘라 나란히 비교했을 때 넷 다 차이를 구분하지 못했다. 빛줄기 그라데이션 위주의 이미지라 압축과 확대에 관대하다.

선택은 WebP 1440px q75 하나다. 이유:

- 예산(120KB) 안에 들면서 포맷이 하나라 `<picture>`와 파일 두 개를 관리할 필요가 없다.
- AVIF는 같은 화질에서 절반이지만, 37KB 차이는 3G Fast에서 0.2초다. 먼저 단순한 쪽으로 가서 LCP를 재고, 예산에 못 들 때 AVIF를 얹는 순서가 맞다. 측정 없이 미리 두 겹을 쌓지 않는다.
- AVIF만 쓰는 것은 2022년 이전 Safari에서 이미지가 아예 안 보인다. 느린 것과 안 되는 것은 다르다.
- 1440px인 이유: 1920 화면에서 1.33배 확대되지만, 레티나 2배 화면에서는 1920짜리도 이미 확대되고 있어 이 자산은 확대가 기본이다. 1:1 비교에서 차이가 안 보이는 선에서 예산에 드는 가장 큰 폭이 1440이었다.
- "화질이 깨지지 않는 선"의 기준: 원본을 같은 폭으로 무손실 축소한 것과 1:1 배율로 나란히 놓고, 그라데이션 경계에 띠(밴딩)가 보이면 멈춘다.

재현 명령 (원본 hero.png는 커밋 `8a0cbf5`에 있다):

```
cwebp -q 75 -resize 1440 0 hero.png -o hero.webp
```

#### 1-4 feature gif 3개: 4.8MB -> mp4 254KB

| | gif | mp4 (H.264, crf 28) | webm (VP9) | 애니메이션 WebP |
|---|---|---|---|---|
| trending | 1,232 KB | 70 KB | 85 KB | 1,253 KB |
| find | 1,940 KB | 102 KB | 154 KB | 1,765 KB |
| free | 1,656 KB | 82 KB | 111 KB | 1,281 KB |

gif는 프레임마다 전체 그림을 저장하고 색이 256개로 제한되는 포맷이라, 사진 계열 움직임에는 비디오 코덱이 15~20배 작다. 애니메이션 WebP는 이 gif들에는 거의 효과가 없었다. `<video autoPlay loop muted playsInline>`로 교체했고, H.264 mp4는 모든 브라우저가 재생해 webm 폴백을 두지 않았다. 세 gif 모두 투명 픽셀이 없어 비디오로 바꿔도 보이는 결과가 같다. 해상도는 원본 그대로 두었다. 지금도 표시 크기(약 740x416)보다 작아서 더 줄일 여지가 없다.

확인한 것: Chrome은 화면 밖에 있는 muted 비디오의 자동재생을 화면에 들어올 때까지 미룬다. gif는 안 보이는 동안에도 계속 디코딩되니 이 동작이 오히려 이득이다.

확인하지 않은 것: iOS Safari의 자동재생. React가 `muted`를 DOM 속성이 아닌 프로퍼티로만 설정하는데, 데스크탑 Chrome에서는 재생을 확인했고 모바일은 관리 대상 밖이라 보지 않았다. 모바일이 대상에 들어오면 여기부터 본다.

재현 명령:

```
ffmpeg -i trending.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 28 trending.mp4
```

배포물 합계: 16.1 MiB -> 676 KB (bundle 282 KiB, hero 115 KiB, mp4 254 KiB).

#### 1-5 CSS 분리

CSS가 bundle.js 안에 문자열로 들어가 style-loader가 런타임에 `<style>`을 만들고 있었다. 프로덕션 빌드에서 `MiniCssExtractPlugin`으로 `main.css`를 따로 내고 `CssMinimizerPlugin`으로 압축했다. 개발 서버는 HMR을 위해 style-loader를 유지한다.

| | 전 | 후 |
|---|---|---|
| bundle.js | 281 KiB / gzip 91 KiB | 259 KiB / gzip 85 KiB |
| main.css | JS 안에 포함 | 9.5 KiB / gzip 2.9 KiB, `<link>`로 병렬 요청 |

CSS를 따로 내면 스크립트 예산에서 빠지는 것 외에도, 브라우저가 JS 실행을 기다리지 않고 스타일을 먼저 적용할 수 있다.

#### 1-5-1 남겨둔 것

`file-loader`는 webpack 5에서 asset modules로 대체됐지만 이번엔 확장자만 늘렸다. 파일명에 해시를 붙이는 다음 작업에서 이 규칙을 어차피 다시 만지므로 그때 함께 바꾼다.

#### 1-6 gzip, brotli

빌드에서 압축 파일을 만들지 않고 서버 압축에 맡긴다. GitHub Pages는 이미 gzip을 적용하고 있었고(개선 전 측정에서 bundle.js `content-encoding: gzip`), CloudFront는 "Compress objects automatically"로 gzip과 brotli를 모두 준다. `compression-webpack-plugin`으로 `.gz`를 만들어 올리는 방식은 S3 객체마다 `Content-Encoding` 메타데이터를 따로 걸어야 해서 관리할 것만 늘어난다. CloudFront 설정은 3단계에서 확인한다.

#### 1단계 결과

| | 개선 전 | 1단계 후 |
|---|---|---|
| bundle.js 전송(gzip) | 311 KiB | 85 KiB |
| CSS | JS에 포함 | 2.9 KiB |
| 히어로 이미지 | 10,428 KiB | 115 KiB |
| feature 이미지 3개 | 4,828 KiB | 254 KiB |
| 배포물 합계 | 16.1 MiB | 686 KB |

스크립트 60KB 예산까지는 25 KiB가 남았다. Search 페이지 코드와 라이브러리를 나누는 2단계에서 다룬다.

### 2 필요한 것만 요청하기

#### 2-1 Home과 Search 분리

`App.tsx`에서 두 페이지를 `React.lazy`로 바꾸고 `<Routes>`만 `Suspense`로 감쌌다. NavBar와 Footer는 페이지 전환 중에도 유지된다. fallback은 우선 `null`이다. 공간을 확보하고 200ms 뒤에 시각 요소를 보이는 fallback 설계는 선택 항목으로 뒤에 다룬다.

| 청크 | 내용 | gzip |
|---|---|---|
| main | react-dom 65.5 KiB, react-router 8.2, react 3.2, scheduler 1.1, NavBar와 Footer 0.2 | 75.7 KiB |
| Home | Home 페이지 | 6.2 KiB |
| Search | Search 페이지 | 3.2 KiB |
| react-icons | 아이콘 3개, Search에서만 요청 | 1.8 KiB |

Home 진입 시 스크립트 전송은 main + Home = 82 KiB다. main에 Search 코드가 없는 것은 문자열 검색으로 확인했다(`load more`, `api.giphy.com` 0건). 분석은 webpack-bundle-analyzer의 gzip 크기 기준이다. webpack stats만 보면 모듈 병합 때문에 react-dom이 보이지 않는다.

#### 스크립트 예산 60KB와 React 19

예산 60KB는 React 18 기준으로 계산된 값이다. react-dom 18.3.1은 minify 후 gzip 42 KiB, 19.3.0은 65.5 KiB로 23 KiB 크다. 이 프로젝트에서 Home 스크립트의 바닥은 React 19를 쓰는 한 약 82 KiB이고, 남은 작업(청크 분리, 캐시)으로는 이 숫자가 움직이지 않는다. React 18이었다면 약 59 KiB로 예산 안이다.

React 19를 유지한다. 의도한 선택이고 비용을 알고 있다. 22 KiB는 3G Fast에서 0.11초다. 이 비용을 낸 이유는 선택 항목에서 `use()`와 Suspense로 trending 로딩을 선언적으로 바꿔 보이려는 것이고, 그 결과가 사용자가 보는 화면(깜빡임 없음, 레이아웃 고정)으로 드러나지 않으면 학습 목적이었다고 그대로 적는다. 요구사항의 작업 항목("Home에 Search 코드가 포함되지 않아야 한다", "아이콘은 사용하는 것만")은 충족했고, 60KB는 참고 수치다.

#### 2-2 해시 파일명, vendor와 runtime 분리, asset modules

| 파일 | gzip | 역할 |
|---|---|---|
| `js/vendor.[hash].js` | 75.9 KiB | react, react-dom, react-router. 앱 코드가 바뀌어도 해시가 유지된다 |
| `js/runtime.[hash].js` | 2.3 KiB | 청크 id와 해시의 대응표. 이걸 분리해야 lazy 청크 하나가 바뀌었을 때 vendor 해시가 같이 바뀌지 않는다 |
| `js/main.[hash].js` | 0.7 KiB | App, NavBar, Footer |
| `js/home.[hash].js`, `css/home.[hash].css` | 6.4 + 1.2 KiB | |
| `js/search.[hash].js`, `css/search.[hash].css` | 3.3 + 1.8 KiB | |
| `js/87.[hash].js` | 1.8 KiB | react-icons 3개, Search에서만 |
| `static/hero.[hash].webp` 등 | | 이미지와 비디오도 해시 |

Home 스크립트 합계는 83.1 KiB로 2-1보다 1 KiB 늘었다. runtime 청크 몫이다. 3단계에서 해시 파일에 1년 캐시를 걸면 재방문 때 vendor 76 KiB를 안 받게 되므로 그때 갚는 비용이다.

같이 정리한 것:

- `file-loader`를 지우고 asset modules(`type: 'asset/resource'`)로 바꿨다. webpack 5의 기본 방식이고 `assetModuleFilename` 하나로 해시를 붙일 수 있다.
- vendor 그룹은 `chunks: 'initial'`로 제한했다. `'all'`로 두면 Search에서만 쓰는 react-icons까지 vendor로 들어가 Home이 안 쓰는 코드를 받는다.
- `webpackChunkName` 주석으로 청크 이름을 `home`, `search`로 붙였다. tsconfig의 `removeComments`가 이 주석을 지우고 있어서 껐다. 출력물은 어차피 minify되므로 크기 영향은 없다.

#### 2-3 도움말 패널은 처음 열 때 마운트

닫혀 있는 패널이 Search 진입 때 외부 gif 7개(고정 이미지 2개, 아티스트 프로필 5종)를 요청하고 있었다. 서버에 크기를 물어보니 합계 10.3 MB로, 트렌딩 gif 16개보다 크다. 아티스트 100명도 닫힌 채로 렌더되고 있었다(리렌더 측정에서 ArtistInfo 100/100).

패널 본문을 처음 열 때 마운트하고 이후에는 유지하도록 `hasOpened` 상태를 두었다. 닫을 때 언마운트하면 슬라이드 아웃 애니메이션 동안 내용이 먼저 사라져서 유지하는 쪽을 택했다.

| | 전 | 후 |
|---|---|---|
| Search 진입 시 패널 이미지 요청 | 7개, 10.3 MB | 0 |
| 닫힌 상태 ArtistInfo 렌더 | 100 | 0 |

#### 2-4 히어로 이미지 우선순위

Lighthouse 진단 "LCP request discovery"가 `fetchpriority=high`를 권했다. React 19가 `fetchPriority` prop을 지원해 히어로 `<img>`에 붙였고 DOM에 `fetchpriority="high"`로 나간다. `<link rel="preload">`는 파일명에 해시가 붙어 HTML 템플릿에 직접 쓸 수 없어 이번엔 넣지 않았다. 3단계 배포 후 LCP 워터폴에서 히어로 요청이 스크립트 실행을 기다리는 것으로 나오면 그때 플러그인으로 preload를 추가한다.

#### 2-5 청크 로드 실패 경로

페이지 코드가 네트워크 요청이 되면서 새 실패 경로가 생겼다. 배포 직후 사용자가 캐시된 옛 `index.html`을 들고 있으면 그 안의 청크 해시가 새 배포에 없어 요청이 404가 나고, 에러 바운더리가 없으면 흰 화면이 된다. `<Suspense>`를 감싸는 작은 `ErrorBoundary`를 두어 안내 문구와 reload 버튼을 보이게 했다. 프로덕션 빌드를 정적 서버에 올리고 search 청크 파일을 지운 뒤 "start search"를 눌러 확인했다. NavBar와 Footer는 유지되고 본문 자리에 안내가 뜬다. 근본 원인인 `index.html` 캐시는 3단계에서 캐시 정책으로 막는다.

같이 정리한 것: 도움말 패널의 `getArtists()` 호출을 실제로 쓰는 `ArtistList` prop 자리로 옮겼고, 번들 분석은 `npm run analyze` 한 줄로 재현되게 스크립트를 두었다.

#### 2단계 결과

| | 개선 전 | 1단계 후 | 2단계 후 |
|---|---|---|---|
| Home 스크립트 전송(gzip) | 311 KiB | 85 KiB | 83.1 KiB (runtime 2.3 + vendor 75.9 + main 0.7 + home 6.4) |
| Home에 Search 코드 | 포함 | 포함 | 없음 |
| react-icons | ai 세트 전체 | 3개 | 3개, Search에서만 |
| Search 진입 시 불필요한 요청 | 패널 이미지 10.3 MB | 같음 | 0 |
| 정적 파일명 | 해시 없음 | 같음 | 전부 해시 |

### 3 같은 건 매번 새로 요청하지 않기

"같은 것"이 세 종류다. 이름에 해시가 붙은 정적 파일, `index.html`, trending API 응답. 앞의 둘은 서버 캐시 헤더로, 마지막은 코드로 다룬다.

#### 3-1 S3 + CloudFront 배포

GitHub Pages는 캐시 헤더를 정할 수 없다. 모든 파일이 `max-age=600`으로 고정이라 10분마다 vendor 76 KiB를 다시 받고, 반대로 배포 직후 10분은 옛 `index.html`이 남는다. 파일마다 다른 정책을 주려면 헤더를 직접 정하는 곳이 필요해서 S3에 올리고 CloudFront로 배포했다.

| 항목 | 값 | 이유 |
|---|---|---|
| S3 | `techcourse-project-2026/salmonbus/less/` | 비공개 버킷. 팀 폴더 아래 개인 폴더 |
| CloudFront | `woowacourse_FE_perf_basecamp_less`, `https://d10cpm8ss0fe9s.cloudfront.net` | |
| 오리진 접근 | OAC(Origin Access Control) | 버킷을 공개하지 않고 CloudFront만 읽게 한다. S3 URL로 직접 들어오면 압축과 엣지 캐시를 건너뛰므로 그 경로를 막는다 |
| Default root object | `index.html` | `/` 요청을 `/index.html`로 |
| Custom error response | 403, 404 -> `/index.html` 200 | SPA 라우팅. `/search`로 직접 들어오면 S3에 그 키가 없어 응답이 오류가 되는데, 이를 `index.html`로 돌려야 react-router가 받는다. OAC 버킷은 ListBucket 권한이 없어 없는 키에 404 대신 403을 주므로 둘 다 잡는다 |
| 캐시 정책 | Managed-CachingOptimized | 오리진의 `Cache-Control`을 따른다(최소 TTL 1초). 압축 형식별로 캐시 키를 나눈다 |
| 압축 | Compress objects automatically | gzip과 brotli. 1-6에서 미뤄둔 항목 |
| Viewer protocol | Redirect HTTP to HTTPS | |

에러 응답 규칙 때문에 없는 청크 파일을 요청해도 200과 HTML이 온다. webpack은 응답 코드가 아니라 청크 등록 여부로 로드 실패를 판정하므로(`ChunkLoadError`, type `missing`) 2-5의 에러 바운더리가 그대로 잡는다.

#### 3-2 캐시 정책

파일이 두 부류다. 이름에 내용 해시가 있는 파일과 없는 파일.

| 파일 | Cache-Control | 이유 |
|---|---|---|
| `js/`, `css/`, `static/` (contenthash) | `public, max-age=31536000, immutable` | 내용이 바뀌면 이름이 바뀐다. 같은 URL의 내용은 영원히 같으므로 재검증 없이 1년(HTTP가 권하는 상한) 쓴다. `immutable`은 새로고침 때도 조건부 요청을 보내지 말라는 뜻이다. Firefox와 Safari가 따르고, Chrome은 이 지시어를 무시하지만 새로고침 시 서브리소스를 재검증하지 않아 결과가 같다 |
| `index.html` | `no-cache` | 배포마다 내용이 바뀌는데 이름이 같다. 저장은 하되 쓰기 전에 항상 서버에 물어본다(ETag 재검증, 안 바뀌었으면 304 헤더뿐). 2-5의 옛 `index.html` 문제를 여기서 막는다 |
| `public/favicon.ico` | `no-cache` | 해시가 없어서 같은 이유. 4 KB라 재검증 비용이 작다 |

`no-store`는 저장 자체를 막아 304도 못 쓰므로 `index.html`에 맞지 않는다. `max-age=0, must-revalidate`는 `no-cache`와 같은 뜻이다.

CloudFront 쪽에서는 CachingOptimized의 최소 TTL이 1초라 `no-cache` 객체도 1초는 엣지에 머물고, 그 다음 요청은 오리진에 조건부 요청으로 재검증한다(`x-cache: RefreshHit from cloudfront`). 재배포 후 무효화(invalidation)를 하지 않아도 1초 뒤 새 `index.html`이 나간다.

#### 3-3 배포 검증

curl로 배포된 파일의 헤더와 전송 크기를 확인했다. 로컬 `dist`와 배포물은 md5(S3 ETag) 기준으로 파일마다 같다.

| 파일 | 원본 | 전송 | Cache-Control | 2번째 요청 |
|---|---|---|---|---|
| `index.html` | 749 B | 749 B (1,000 B 미만은 압축 안 함) | `no-cache` | `RefreshHit` |
| `js/runtime` | 4,941 B | 2,148 B (br) | immutable | `Hit` |
| `js/vendor` | 239,230 B | 71,965 B (br) | immutable | `Hit` |
| `js/main` | 1,699 B | 815 B (br) | immutable | `Hit` |
| `js/home` | 13,472 B | 6,073 B (br) | immutable | `Hit` |
| `css/main`, `css/home` | 1,918 + 2,954 B | 692 + 1,070 B (br) | immutable | `Hit` |
| `static/hero.webp` | 118,078 B | 118,078 B (이미지는 압축 대상 아님) | immutable | `Hit` |
| mp4 3개 | 259,665 B | 259,665 B | immutable | `Hit` |
| `/search` | | `index.html` 749 B | `no-cache` | 403 -> 200, `Error from cloudfront`가 정상 |

Home 스크립트 4개는 brotli로 79.1 KiB다(2단계 gzip 83.1 KiB에서 4 KiB 감소). 히어로 115.3 KiB, Home 첫 방문 전체 455 KiB. 재방문 때는 `index.html` 재검증 한 번만 서버에 가고 나머지는 디스크 캐시에서 오는 것이 기대값이고, 개선 후 측정에서 LCP 2차 로드로 확인한다.

#### 3-4 재배포 절차

`npm run build:prod` 후 S3 `salmonbus/less/`에 두 묶음으로 올린다. `js/`, `css/`, `static/`는 `Cache-Control: public, max-age=31536000, immutable` 메타데이터로, `index.html`과 `public/`은 `no-cache`로. CloudFront 무효화는 필요 없다. 옛 해시 파일은 지우지 않는다. 배포 직전에 옛 `index.html`을 받아 둔 사용자가 잠시 뒤 옛 청크를 요청할 수 있어서다.

#### 3-5 trending 응답 캐시

Giphy trending 응답에는 `cache-control`, `etag`, `last-modified`가 없다. 브라우저 HTTP 캐시가 아무것도 못 하고, Search 페이지가 마운트될 때마다 152 KB JSON을 새로 받는다. 이 앱에서 가장 흔한 재진입은 Home과 Search를 오가는 것이다.

`src/pages/Search/trendingCache.ts`에 `readFresh()`와 `refresh()` 둘만 두었다. 모듈 변수에 목록과 받은 시각을 들고 있고, 10분이 지나면 `readFresh()`가 `null`을 준다. 훅은 `useState(() => trendingCache.readFresh() ?? [])`로 시작하고, 캐시가 없을 때만 `refresh()`를 부른다. 초기값과 effect에서 두 번 읽는 이유는 effect의 읽기가 요청을 생략할지 정하는 판단이기 때문이고, 그 사이에 만료를 넘기면 effect가 새로 받아 덮어쓴다. `gifAPIService`는 손대지 않았다.

| 축 | 고른 것 | 대안과 버린 이유 |
|---|---|---|
| 저장소 | 메모리 | sessionStorage나 localStorage는 새로고침 뒤 첫 요청 하나를 더 막는 대신 직렬화, 예외 처리(시크릿 모드, 용량 초과), 만료 항목 정리가 따라온다. 새로고침은 사용자가 새로 받겠다고 한 행동으로 보고 막지 않았다 |
| 만료 | 10분 | 없으면 탭을 하루 열어둔 사용자에게 어제 목록이 무한정 나간다. trending은 신선함이 곧 가치라 짧게 잡았고, 한 세션 안의 왕복은 대부분 10분 안에 끝난다. 1시간도 설명 가능한 값이다. 재검토 조건: Search 진입 수 대비 trending 요청 수가 절반을 넘으면(캐시가 거의 안 맞는다는 뜻) 늘린다 |
| 위치 | 전용 모듈 | 훅 안 모듈 변수는 diff가 가장 작지만 훅이 검색 상태 기계와 캐시 규칙을 같이 알게 된다. 서비스 안에 넣으면 "언제 새로 받나"라는 제품 판단이 API 계층에 들어가고 검색은 캐시하지 않는 비대칭이 서비스 안에 생긴다. 범용 `withCache(fetcher, ttl)`는 쓰는 곳이 하나라 아직 근거가 없다 |
| 단위 | 데이터 | Promise를 캐시하면 동시 요청 중복까지 막지만 이 앱은 Search가 하나라 동시 요청이 없고, 실패한 Promise를 지우는 코드가 따라온다. 선택 항목에서 `use()`로 갈 때 이 파일만 바꾸면 된다 |
| 채우는 시점 | `useState` 초기값 | `useEffect`에서 `setGifList(cached)`를 하면 커밋이 둘로 나뉜다. 아래 측정 |

재진입 때 DOM 추가 묶음(MutationObserver)과 그 사이 프레임(rAF)을 세어 두 방식을 비교했다. dev 서버, 캐시가 채워진 상태에서 Home으로 갔다가 다시 Search로.

| 채우는 방식 | 클릭으로 재진입 | 뒤로가기로 재진입 |
|---|---|---|
| `useEffect`에서 set | 커밋 2회(0장 -> 16장), 사이에 페인트 0 | 커밋 2회, 사이에 페인트 1. 빈 목록이 한 프레임 그려지고 Footer가 밀린다 |
| `useState` 초기값 | 커밋 1회(16장) | 커밋 1회(16장) |

클릭은 React가 discrete 이벤트에서 생긴 passive effect를 페인트 전에 동기로 비워서 화면 차이가 없다. 뒤로가기(popstate)는 React 이벤트 밖이라 두 커밋 사이에 페인트가 끼어든다. 초기값으로 넣으면 어느 쪽이든 커밋 1회다.

확인한 것: Search에 3번 들어가는 동안 trending 요청 1회. `Date.now`를 11분 앞당기면 재진입 때 새로 요청하고(2회), 그 뒤 재진입은 다시 생략한다.

안 한 것: 같은 검색어 재검색도 같은 요청이지만 요구사항은 trending이고, 검색어까지 캐시하게 되면 사용처가 둘이 되어 그때 범용 래퍼로 올릴 근거가 생긴다.

#### 3단계 결과

| | 개선 전 | 3단계 후 |
|---|---|---|
| 정적 파일 캐시 | 모든 파일 `max-age=600`, 10분마다 재검증 | 해시 파일 1년 `immutable`, `index.html` `no-cache` |
| 압축 | gzip (GitHub Pages) | brotli (CloudFront) |
| Home 스크립트 전송 | 311 KiB | 79.1 KiB |
| 히어로 이미지 전송 | 10,428 KiB | 115.3 KiB |
| Search 재진입 시 trending 요청 | 매번 152 KB | 10분 안에는 0 |
| 배포 후 옛 `index.html` 문제 | 최대 10분 | 재검증이라 없음 |

### 4 최소한의 변경만 일으키기

## 개선 후 측정

(개선 전과 같은 환경에서 재측정)
