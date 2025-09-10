import { type RefObject, useEffect, useRef } from 'react';

export const useCustomCursor = (cursorRef: RefObject<HTMLDivElement>) => {
  const ticking = useRef(false);

  useEffect(() => {
    const updateCursorPosition = (x: number, y: number) => {
      if (cursorRef.current) {
        // transform 속성으로 GPU 가속 활용
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // 애니메이션 프레임이 끝났음을 표시
      ticking.current = false;
    };

    let rafID: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      const { pageX, pageY } = e;
      if (!ticking.current) {
        // rAF를 활용하여 브라우저 리페인트 주기에 동기화
        // 새로운 애니메이션 프레임 요청, 애니메이션 예약 - ticking 플래그 설정
        rafID = requestAnimationFrame(() => updateCursorPosition(pageX, pageY));
        ticking.current = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      // 이벤트 리스너 제거, 애니메이션 프레임 취소
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafID) {
        cancelAnimationFrame(rafID);
      }
    };
  }, [cursorRef]);
};
