import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const ticking = useRef(false);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (!ticking.current) {
        rafId = requestAnimationFrame(() => {
          onScroll();
          ticking.current = false;
        });

        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [onScroll]);
};

export default useScrollEvent;
