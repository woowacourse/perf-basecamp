import { useEffect } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        onScroll();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onScroll]);
};

export default useScrollEvent;
