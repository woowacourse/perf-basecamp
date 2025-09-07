import { useEffect, useCallback, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef<number>(0);

  const optimizedScrollHandler = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (Math.abs(currentScrollY - lastScrollY.current) < 1) {
      return;
    }

    lastScrollY.current = currentScrollY;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      onScroll();
    });
  }, [onScroll]);

  useEffect(() => {
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [optimizedScrollHandler]);
};

export default useScrollEvent;
