# memegle 성능 개선 기록

접근 순서: 측정 -> 분석 -> 개선 -> 재측정

## 측정 환경

같은 환경에서 개선 전/후를 비교한다.

| 항목 | 값 |
|---|---|
| 측정일 | 2026-09-19 |
| 브라우저 | Chrome 시크릿 창, 확장 프로그램 없음 |
| Lighthouse | DevTools > Lighthouse > Navigation, Desktop |
| 네트워크 | Fast 3G (DevTools), WebPageTest는 Paris / Chrome / 3G Fast |
| CPU | 6x slowdown (Performance 탭) |
| 개선 전 배포 | https://lee-eojin.github.io/perf-basecamp |
| 개선 후 배포 | (CloudFront 주소) |

## 개선 전 측정

### 빌드 산출물 (npm run build:prod)

| 파일 | 크기 | gzip |
|---|---|---|
| bundle.js | 1.18 MiB | 306 KiB |
| bundle.js.map | 1.39 MiB | |
| hero.png | 10.2 MiB | |
| find.gif | 1.89 MiB | |
| free.gif | 1.61 MiB | |
| trending.gif | 1.2 MiB | |
| 합계 | 16.1 MiB | |

### 지표

| 지표 | 목표 | 개선 전 | 개선 후 |
|---|---|---|---|
| Lighthouse Performance | 95 이상 | | |
| Home 스크립트 전송 크기 | 60 KB 미만 | | |
| 히어로 이미지 크기 | 120 KB 미만 | | |
| Home LCP 1차 로드 (Paris, Fast 3G) | 2.5s 미만 | | |
| Home LCP 2차 로드 (Paris, Fast 3G) | 1.5s 미만 | | |
| Dropped Frame | 없음 | | |
| Partially Presented Frame | 최소 | | |
| load more 시 기존 GifItem 리렌더 | 없음 | | |

### Lighthouse 진단 항목

(Lighthouse가 지목한 항목과 절감 가능치를 적는다)

## 분석

(측정 결과에서 예산을 벗어난 지점과 원인)

## 개선 작업

### 1 요청 크기 줄이기

### 2 필요한 것만 요청하기

### 3 같은 건 매번 새로 요청하지 않기

### 4 최소한의 변경만 일으키기

## 개선 후 측정

(개선 전과 같은 환경에서 재측정)
