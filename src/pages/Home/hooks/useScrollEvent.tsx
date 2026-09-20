import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

/**
 * scroll 이벤트는 프레임보다 자주 발생할 수 있다.
 * requestAnimationFrame으로 프레임당 1회만 실행되도록 제한한다.
 */
const useScrollEvent = (onScroll: ScrollHandler) => {
  const handlerRef = useRef(onScroll);
  handlerRef.current = onScroll;

  useEffect(() => {
    let rafId: number | null = null;

    const flush = () => {
      rafId = null;
      handlerRef.current();
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(flush);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
};

export default useScrollEvent;
