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

**WebPageTest** — Paris / Fast 3G / Chrome

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

## WebPageTest (Paris, Fast 3G)

`wpt-after-preload.json` — 최종 상태, First View

| 지표 | 값 | 요구사항 |
| --- | --- | --- |
| TTFB | 1,534ms | |
| FCP | 3,655ms | |
| **LCP** | **4,788ms** | 첫 로드 < 2,500ms — 미달 |
| TBT | 0ms | |
| CLS | 0.176 | |
| Speed Index | 4,718ms | |

Repeat View는 측정하지 않아 "두 번째 이후 로드 LCP < 1.5s"는 아직 확인되지 않았다.

### 남은 병목

Lighthouse 95점과 달리 Fast 3G에서는 LCP가 목표의 약 2배다. 원인이 둘이다.

**1. TTFB 1,534ms** — CloudFront 캐시가 비어 있어 S3까지 다녀온 첫 요청이다.
캐시가 채워진 뒤 재측정하면 줄어든다.

**2. Google Fonts 외부 의존** — CSS가 렌더링을 차단하고(`renderBlockingCSS: 1`),
외부 도메인 두 곳을 순차로 거친다.

```
1,555ms  CSS 요청 (fonts.googleapis.com)
2,252ms  CSS 완료
3,476ms  폰트 파일 요청 (fonts.gstatic.com)
3,881ms  폰트 완료
3,600ms  최초 렌더
```

CLS 0.176도 같은 원인이다. 시스템 폰트로 먼저 그려졌다가 3,881ms에 웹폰트가
도착하며 텍스트가 재배치된다. Lighthouse에서 CLS가 0이었던 것은 네트워크가 빨라
폰트가 첫 페인트 전에 도착했기 때문이고, Fast 3G에서 드러난 문제다.

폰트를 자체 호스팅하면 FCP·LCP·CLS가 함께 개선될 것으로 보인다.
