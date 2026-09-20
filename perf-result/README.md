# 성능 측정 결과

개선 단계마다 같은 조건으로 측정한 기록이다.
원본 JSON은 용량이 커서 추적하지 않고, 아래 요약만 남긴다.

```
perf-result/
  lighthouse/    lh{1,2,3}-{단계}.json    각 단계 3회 측정
  webpagetest/   wpt-{단계}.json
```

## 측정 방법

**Lighthouse** — 각 단계마다 3회 측정하고 중앙값을 사용한다.

```bash
./scripts/measure-lh.sh <단계명>            # 3회 측정 후 저장
LH_URL=<주소> ./scripts/measure-lh.sh <단계명>

python3 scripts/compare-lh.py               # 전체 단계 비교
python3 scripts/compare-lh.py before after-preload
```

조건: lighthouse 13.4.1, mobile, `throttling-method=devtools` (CPU 4x, 느린 4G)

`before`와 `after-hero`는 Chrome DevTools UI에서, 나머지는 CLI(headless)에서 측정했다.
버전과 스로틀링 방식은 맞췄지만 headless 여부가 달라 완전히 동일한 조건은 아니다.

`after-cdn`부터는 배포처가 GitHub Pages에서 CloudFront로 바뀌었다.

**WebPageTest** — Amsterdam / 3G Fast (1.6Mbps, 150ms RTT) / iPhone 15, Chrome 148

요구사항은 Paris 기준이나 측정은 Amsterdam에서 이루어졌다. Repeat View는 아직 측정하지 않았다.

## Lighthouse 단계별 결과 (중앙값)

| 단계 | Perf | FCP | LCP | TBT | CLS | SI |
| --- | --- | --- | --- | --- | --- | --- |
| before | 59 | 3,215ms | 30,765ms | 306ms | 0.006 | 4,309ms |
| 히어로 이미지 WebP 변환 | 63 | 3,213ms | 6,057ms | 231ms | 0.006 | 5,146ms |
| GIF → MP4 교체 | 68 | 3,471ms | 6,117ms | 0ms | 0.006 | 5,136ms |
| minify + 소스맵 제거 | 73 | 2,648ms | 5,452ms | 0ms | 0.006 | 4,456ms |
| 코드 분할 | 80 | 1,679ms | 4,831ms | 0ms | 0.000 | 3,934ms |
| trending 캐싱 | 80 | 1,709ms | 4,868ms | 0ms | 0.000 | 3,968ms |
| 렌더링 최적화 | 80 | 1,752ms | 4,876ms | 0ms | 0.000 | 3,986ms |
| CDN 적용 | 80 | 1,748ms | 4,828ms | 0ms | 0.000 | 3,916ms |
| **히어로 preload** | **95** | 1,972ms | **2,598ms** | 0ms | 0.000 | 2,625ms |

**before → 최종: Performance +36점, LCP -91.6%, TBT -100%**

### 단계별로 무엇이 바뀌었나

**히어로 이미지 WebP 변환** — 4100×2735 / 8.5MB PNG를 1440×961 / 109KB WebP로 교체.
LCP 30.8초의 대부분이 이 파일을 받는 시간이었다.

**GIF → MP4 교체** — GIF 3개(4.7MB)를 MP4(264KB)로. GIF 디코딩이 메인 스레드에서
일어나던 것이 사라지면서 TBT가 0이 되었다.

**minify + 소스맵 제거** — webpack config가 mode와 무관하게 `minimize: false`였다.
번들 1.18MB → 205KB, 소스맵 1.4MB 제거.

**코드 분할** — Home 진입 시 Search 코드와 react-icons를 함께 받고 있었다.
Home 스크립트가 69KB → 55.6KB(gzip)로 줄어 요구사항(< 60kb)을 만족한다.

**trending 캐싱 / 렌더링 최적화** — Home 로드 지표는 그대로다.
전자는 Search 페이지 API 호출, 후자는 로드 후 상호작용에 해당해 Lighthouse 범위 밖이다.

**CDN 적용** — `x-cache: Hit from cloudfront` 확인. 지표 변화는 크지 않았다.

**히어로 preload** — 코드 분할 이후 히어로 이미지 요청이 Home 청크 실행 시점까지
밀려 있었다(2,286ms → 666ms). LCP가 4.8초에서 2.6초로 떨어지며 95점에 도달했다.

## WebPageTest (Amsterdam, 3G Fast)

First View 기준. 두 번 측정했고, 2차는 CloudFront 캐시가 채워진 상태다.

| 지표 | 1차 | 2차 | 요구사항 |
| --- | --- | --- | --- |
| TTFB | 1,534ms | 1,505ms | |
| FCP | 3,655ms | 3,033ms | |
| **LCP** | 4,788ms | **3,033ms** | 첫 로드 < 2,500ms — 미달 |
| CLS | 0.176 | 0.366 | |
| TBT | 0ms | 0ms | |
| Speed Index | 4,718ms | 3,221ms | |
| fullyLoaded | 6,861ms | 4,825ms | |

2차에서 LCP가 37% 줄었다. CDN 캐시가 채워지며 히어로 이미지 다운로드가
1,697ms에서 844ms로 짧아진 결과다.

2차의 FCP와 LCP가 3,033ms로 같다. 히어로 이미지가 첫 페인트와 동시에 그려졌다는
뜻으로, preload가 의도대로 동작하고 있다. 따라서 LCP는 이제 FCP에 묶여 있다.

"두 번째 이후 로드 LCP < 1.5s"는 Repeat View를 측정하지 않아 확인되지 않았다.

### 남은 병목

LCP가 FCP와 같아진 지금, 남은 병목은 FCP를 늦추는 요인이다.

**1. Google Fonts 외부 의존** — CSS가 렌더링을 차단하고(`renderBlockingCSS: 1`),
외부 도메인 두 곳을 순차로 거친다.

```
2,390ms  CSS 요청 (fonts.googleapis.com)
2,789ms  CSS 완료
         그 뒤에야 폰트 파일 요청 시작 (fonts.gstatic.com)
3,000ms  최초 렌더
```

CLS도 같은 원인이다. 시스템 폰트로 먼저 그려진 뒤 웹폰트가 도착하며 텍스트가
재배치된다. 2차에서 CLS가 0.366으로 커진 것은 렌더링이 600ms 빨라진 반면
폰트 도착 시점은 그대로여서, 시스템 폰트로 보이는 구간이 길어졌기 때문이다.

Lighthouse에서 CLS가 0인 것은 네트워크가 빨라 폰트가 첫 페인트 전에 도착하기
때문이고, 3G에서만 드러나는 문제다.

폰트를 자체 호스팅하면 FCP·LCP·CLS가 함께 개선될 것으로 보인다.

**2. TTFB 1,505ms** — 3G의 왕복 지연(150ms RTT)에 DNS·TCP·TLS 협상이 누적된다.
정적 사이트에서 더 줄이기는 어렵다.
