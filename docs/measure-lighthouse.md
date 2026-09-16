# 측정 절차: Lighthouse

Chrome DevTools에 내장된 Lighthouse로 Performance 점수와 Core Web Vitals를 측정하는 절차다.
개선 전/후를 같은 조건으로 비교하기 위해 아래 순서를 그대로 따른다.

## 사전 준비

- 측정 대상은 로컬 개발 서버가 아니라 **배포된 주소**다. 개발 빌드는 minify가 안 되어 있어 수치가 다르다.
  - 개선 전: `https://geongyu09.github.io/perf-basecamp`
  - 개선 후: CloudFront 배포 주소
- **시크릿 창**(⇧⌘N)에서 연다. 확장 프로그램이 스크립트를 주입해 점수를 왜곡하는 것을 막기 위해서다.
- 측정 중에는 다른 탭에서 무거운 작업(영상 재생, 빌드 등)을 하지 않는다. CPU 스로틀링이 걸린 상태라 영향이 크다.

## 절차

1. 시크릿 창에서 측정 URL을 연다.
2. DevTools를 연다(⌥⌘I). 상단 탭에서 **Lighthouse**를 고른다. 안 보이면 `»` 버튼 안에 있다.
3. 옵션을 아래처럼 맞춘다.

   | 옵션 | 값 | 이유 |
   | --- | --- | --- |
   | Mode | Navigation (Default) | 페이지 최초 로드를 측정한다 |
   | Device | Mobile | 미션 기준. CPU 4x 스로틀링 + 모바일 네트워크 시뮬레이션이 자동 적용된다 |
   | Categories | Performance만 체크 | 다른 카테고리는 측정 시간만 늘린다 |
   | Clear storage | 체크 | 캐시 없는 첫 방문 기준 |

4. **Analyze page load**를 누르고 결과가 나올 때까지 기다린다. 측정 중 창을 건드리지 않는다.
5. 결과 화면 상단의 **Performance 게이지**를 캡처한다. 게이지 주변의 색으로 어느 지표가 문제인지 한눈에 볼 수 있다(초록 양호 / 주황 개선 필요 / 빨강 나쁨).
   - 저장: `docs/images/lighthouse-{page}-{before|after}.png`
6. 게이지 아래 **METRICS** 섹션을 캡처한다. FCP, LCP, TBT, CLS, Speed Index 5개 수치가 나온다.
   - 저장: `docs/images/lighthouse-{page}-metrics-{before|after}.png`
7. 수치를 리포트 표에 옮긴다. 이 5개가 Performance 점수를 구성한다.
8. 같은 조건으로 **3회 반복**해 중앙값을 기록한다. 네트워크 상태에 따라 LCP가 1~2초씩 흔들릴 수 있다.
   - 재측정은 결과 화면 좌상단 `+` 버튼 → 옵션 확인 → Analyze page load.
9. 결과 화면 우상단 `⋮` → **Save as JSON**으로 원본을 남긴다.
   - 저장: `docs/lighthouse/{page}-{before|after}.json`

## 결과 읽는 법

- **Performance 점수**: 5개 지표의 가중 합. LCP 25%, TBT 30%, CLS 25%, FCP 10%, SI 10%.
- **LCP만 빨갛고 나머지가 초록**이면 스크립트 실행보다 큰 리소스(보통 이미지) 로딩이 병목이다. 이 경우 Network 탭에서 어떤 파일이 오래 걸리는지 확인한다([measure-network.md](./measure-network.md)).
- **TBT가 높으면** JS 실행 시간이 문제다. Performance 탭에서 Long Task를 찾는다.
- 결과 화면을 아래로 내리면 **Diagnostics** 섹션에 "Properly size images", "Serve images in next-gen formats" 같은 개선 항목과 예상 절감량이 나온다. 개선 우선순위를 정할 때 참고한다.
- LCP 요소가 무엇인지는 Diagnostics의 **Largest Contentful Paint element** 항목에서 확인한다.

## Search 페이지 측정 시

- URL을 `.../perf-basecamp/search`로 바꿔 같은 절차로 측정한다.
- Search 페이지는 GIPHY API를 호출하므로 API 응답 속도에 따라 LCP가 흔들린다. 3회 중앙값이 특히 중요하다.

## 주의

- Lighthouse의 네트워크 스로틀링은 **시뮬레이션**이다. 실제 Fast 3G로 재는 WebPageTest나 DevTools Network 스로틀링과 수치가 다를 수 있다. 같은 도구끼리만 비교한다.
- 개선 후 측정 시 CloudFront 캐시가 아직 채워지지 않았다면(첫 요청) 수치가 나쁘게 나온다. 한 번 접속해 캐시를 채운 뒤 측정한다.
