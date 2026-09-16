# 측정 절차: Network 리소스 내역

Chrome DevTools Network 탭으로 페이지 첫 로드 시 받는 리소스의 개수, 크기, 압축 여부, 캐시 헤더를 측정하는 절차다.
크기는 스로틀링과 무관하므로 스로틀링 없이 측정한다.

## 사전 준비

- [measure-lighthouse.md](./measure-lighthouse.md)와 같이 **배포된 주소**를 **시크릿 창**에서 연다.

## 1. 전체 합계 측정

1. DevTools(⌥⌘I) → **Network** 탭.
2. 상단 옵션에서 **Disable cache** 체크, **Preserve log** 체크.
3. ⌘R로 새로고침한다. 페이지가 완전히 뜰 때까지 기다린다.
4. 하단 상태 바를 읽는다. 아래 형식으로 나온다.

   ```
   10 requests | 16.0 MB transferred | 16.9 MB resources | Finish: 2.66 s | DOMContentLoaded: 294 ms | Load: 2.56 s
   ```

   | 항목 | 의미 |
   | --- | --- |
   | requests | 요청 수 |
   | transferred | 네트워크로 실제 받은 양(압축 후). 리포트의 "전송 크기" |
   | resources | 압축 해제 후 크기. 리포트의 "원본 크기" |
   | DOMContentLoaded | HTML 파싱 완료 시점 |
   | Load | 이미지 포함 모든 리소스 로드 완료 시점 |
   | Finish | 마지막 네트워크 활동 시점 |

   transferred와 resources의 차이가 압축으로 절감된 양이다. 차이가 작으면 압축이 안 되고 있거나, 압축이 안 되는 리소스(이미지)가 대부분이라는 뜻이다.

## 2. 종류별 합계 측정

1. 필터 줄(`All | Fetch/XHR | Doc | CSS | JS | Font | Img | Media | ...`)에서 **JS**를 클릭한다.
   필터 줄이 안 보이면 좌상단 깔때기 아이콘을 누른다.
2. 하단 상태 바가 `1 / 10 requests | 319 kB / 16,000 kB transferred | 1,239 kB / 16,919 kB resources`처럼 바뀐다.
   앞 숫자가 해당 종류만의 값이다.
3. **CSS**, **Font**, **Img**, **Other**를 차례로 클릭해 같은 방식으로 읽는다.
4. 끝나면 **All**로 되돌린다.

## 3. 개별 파일 확인

1. 컬럼 헤더 **Size**를 클릭해 큰 순서로 정렬한다.
2. Size 칸이 한 줄만 보이면 필터 줄 옆 **Large request rows** 아이콘(위아래 화살표)을 켠다. 위가 전송 크기, 아래가 원본 크기다.
3. 상위 항목의 파일명과 크기를 기록한다. LCP 요소로 의심되는 파일(히어로 이미지)의 전송 크기는 반드시 적는다.
4. **Time** 컬럼으로 정렬하면 어떤 파일이 로드를 오래 붙잡는지 보인다.

## 4. 압축 여부와 캐시 헤더 확인

1. 목록에서 파일을 클릭하면 오른쪽에 상세 패널이 열린다.
2. **Headers** 탭 → **Response Headers**에서 다음 두 값을 찾는다.

   | 헤더 | 읽는 법 |
   | --- | --- |
   | `content-encoding` | `gzip` 또는 `br`이면 압축됨. 헤더가 없으면 비압축 |
   | `cache-control` | `max-age=초`가 브라우저 캐시 유효 시간. `no-cache`, `no-store`면 매번 재요청 |

3. HTML, JS, CSS, 이미지, 폰트 각 하나씩 확인한다. 같은 서버에서 오는 파일은 대체로 같은 정책이다.

## 5. 번들에 다른 페이지 코드가 포함됐는지 확인

1. JS 파일을 클릭 → **Response** 탭.
2. ⌘F로 다른 페이지에서만 쓰는 이름을 검색한다. 이 프로젝트에서는 `SearchResult`, `HelpPanel`, `trending`.
3. 검색 결과가 있으면 Home 번들에 Search 코드가 포함된 것이다.
4. react-icons 포함 범위는 `GenIcon`을 검색해 개수를 본다. 수백 개면 패키지 전체가 들어간 것이다. 소스에서 실제 쓰는 아이콘 수는 아래로 확인한다.

   ```bash
   grep -rn "react-icons" src
   ```

## 6. 원본 저장

1. 목록 빈 곳 우클릭 → **Save all as HAR with content**.
   "with content"가 붙은 항목이어야 JS 본문까지 포함되어 나중에 5번 검사를 다시 할 수 있다.
   - 저장: `docs/network/{page}-{before|after}.har`
2. **All** 필터, Size 정렬 상태에서 Name, Type, Size, Time 컬럼이 보이게 캡처한다.
   - 저장: `docs/images/network-{page}-{before|after}.png`

## 반복 로드(캐시) 확인

같은 절차로 **Disable cache를 끄고** 한 번 더 새로고침하면 캐시 동작을 볼 수 있다.

- Size 칸에 `(memory cache)` 또는 `(disk cache)`가 표시되면 캐시에서 온 것이다.
- Status가 `304`면 서버에 재검증 요청을 보낸 것이다. 캐시는 됐지만 요청 자체는 발생했다.
- `200`에 실제 크기가 찍히면 캐시가 안 된 것이다. `cache-control` 값을 다시 본다.

## 주의

- Lighthouse와 같은 세션에서 측정하면 편하지만, Lighthouse 실행 중에는 Network 탭 기록이 초기화된다. Network 측정을 먼저 하거나 별도 탭에서 한다.
- Load 시간은 스로틀링 없는 값이라 Lighthouse LCP와 직접 비교하지 않는다. 비교하려면 필터 줄 오른쪽 **No throttling** 드롭다운을 **Fast 3G**로 바꾸고 다시 측정한다.
