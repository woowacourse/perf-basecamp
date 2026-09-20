import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const onScrollRef = useRef(onScroll);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  // The handler is kept in a ref so the listener registers once instead of on every render.
  useEffect(() => {
    let frameId: number | null = null;

    // scroll fires more often than the browser paints, so the handler is
    // coalesced into a single call per animation frame.
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
