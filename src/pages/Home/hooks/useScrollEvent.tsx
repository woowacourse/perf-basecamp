import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

/**
 * 스크롤 이벤트를 프레임당 한 번으로 제한해 실행한다.
 *
 * 스크롤은 한 번에 여러 번 발생할 수 있어, 핸들러를 그대로 붙이면
 * 한 프레임 안에서 중복 실행되어 프레임을 놓치기 쉽다.
 */
const useScrollEvent = (onScroll: ScrollHandler) => {
  // 핸들러가 매 렌더마다 새로 만들어져도 리스너를 다시 등록하지 않도록 ref에 담는다.
  const savedHandler = useRef(onScroll);

  useEffect(() => {
    savedHandler.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        savedHandler.current();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
};

export default useScrollEvent;
