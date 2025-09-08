import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [onScroll]);
};

export default useScrollEvent;
