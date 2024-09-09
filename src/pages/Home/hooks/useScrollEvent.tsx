import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleScroll = (event: Event) => {
      rafRef.current = requestAnimationFrame(() => {
        onScroll();
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [onScroll]);
};

export default useScrollEvent;
