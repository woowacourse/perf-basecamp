import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const scrollAnimationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (scrollAnimationFrameRef.current) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }
      scrollAnimationFrameRef.current = requestAnimationFrame(() => {
        onScroll();
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
};

export default useScrollEvent;
