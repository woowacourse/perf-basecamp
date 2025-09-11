import { useCallback, useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useOptimizedScrollEvent = (onScroll: ScrollHandler) => {
  const rafRef = useRef<number>();

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      onScroll();
    });
  }, [onScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);
};

export default useOptimizedScrollEvent;
