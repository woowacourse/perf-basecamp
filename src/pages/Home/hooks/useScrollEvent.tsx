import { useCallback, useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const frameRef = useRef<number | null>(null);

  const handleScroll = useCallback(
    (event: Event) => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(() => {
          onScroll();

          frameRef.current = null;
        });
      }
    },
    [onScroll]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
};

export default useScrollEvent;
