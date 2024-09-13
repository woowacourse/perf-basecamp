import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      requestRef.current = requestAnimationFrame(() => {
        onScroll();

        requestRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
};

export default useScrollEvent;
