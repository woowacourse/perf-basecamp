import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const onScrollRef = useRef(onScroll);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    let frameId: number | null = null;

    const flushScroll = () => {
      frameId = null;
      onScrollRef.current();
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(flushScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);
};

export default useScrollEvent;
