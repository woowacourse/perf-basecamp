import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const requestAnimationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
        return;
      }

      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        onScroll();
        requestAnimationFrameRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [onScroll]);
};

export default useScrollEvent;
