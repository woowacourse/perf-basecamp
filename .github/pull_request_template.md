## 🔥 결과

<!-- 개선 목표에 있는 측정 항목들에 대해 개선 작업 전/후의 성능 측정 결과를 적어주세요. -->

- 배포한 CloudFront 접근 경로:
- 개선 전후 성능 측정 결과
  - 개선 전 (GitHub Pages)
  - 개선 후 (CloudFront)

## ✅ 개선 작업 목록

<!-- 각 요구사항을 위해 어떤 개선 작업을 진행했는지 적어주세요
코드 변경사항으로 확인하기 어려운 CloudFront 설정 사항 등은 리뷰어가 확인할 수 있게 스크린샷이나 적용한 항목들을 적어주면 좋겠지요? 🙂
-->

**1 요청 크기 줄이기**

- [ ] 소스코드 크기 줄이기
  - [x] prod 환경에서 `optimization.minimize` 옵션적용으로 `terserPlugin`을 통해 **minify, uglify** 적용
  - [ ] gzip 적용
- [ ] 이미지 크기 줄이기
  - [ ] `ImageMinimizerPlugin` 적용
    - [x] `sharp` 을 통해 gif,png -> webp로 변환 및 압축
    - [ ] `srcset` 적용(선택)
- [ ] 폰트(선택)
  - [ ] subset적용
  - [ ] FOUT 개선

**2 필요한 것만 요청하기**

- [x] 페이지별 리소스 분리(home 페이지에서 giphy모듈 제외하기)
  - [x] react.lazy 사용하여 page 단위 컴포넌트에 `코드 스플리팅 적용`
- [x] 아이콘 패키지 Tree Shaking
  - [x] usedExports 옵션 기본 적용으로 icons 패키지 `트리쉐이킹 완료`

**3 같은 건 매번 새로 요청하지 않기**

- [ ] CloudFront 캐시 설정 (설정값, 해당 값을 설정한 이유 포함)
- [ ] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.

**4 최소한의 변경만 일으키기**

- [ ] 검색 결과 > 추가 로드시 추가된 목록만 새로 렌더되어야 한다.
- [ ] Layout Shift 없이 애니메이션이 일어나야 한다.
- [ ] Frame Drop이 일어나지 않아야 한다.
  - (Chrome DevTools 기준) Partially Presented Frame 역시 최소로 발생해야 한다.

## 🧐 공유

<!-- 작업하면서 든 생각, 질문, 새롭게 학습하거나 시도해본 내용 등등 공유할 사항이 있다면 자유롭게 적어주세요 -->
