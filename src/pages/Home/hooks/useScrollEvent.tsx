import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const ticking = useRef<boolean>(false);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (!ticking.current) {
      }
      requestAnimationFrame(() => {
        onScroll();
        ticking.current = false;
      });
      ticking.current = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
};

export default useScrollEvent;
