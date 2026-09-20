import { RefObject, useEffect } from 'react';

/**
 * 마우스 위치를 추적해 대상 엘리먼트를 따라 움직이게 한다.
 *
 * 위치를 state로 관리하면 mousemove마다 리렌더가 발생하므로,
 * ref에 직접 transform을 적용하고 requestAnimationFrame으로
 * 프레임당 한 번만 갱신한다.
 */
const useMousePosition = (targetRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    let rafId: number | null = null;
    let pageX = 0;
    let pageY = 0;

    const render = () => {
      rafId = null;

      const target = targetRef.current;
      if (target === null) return;

      // top/left 대신 transform을 사용해 레이아웃을 다시 계산하지 않도록 한다.
      target.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
    };

    const handleMouseMove = (event: MouseEvent) => {
      pageX = event.pageX;
      pageY = event.pageY;

      // 이미 예약된 프레임이 있으면 좌표만 갱신하고 새로 예약하지 않는다.
      if (rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [targetRef]);
};

export default useMousePosition;
