import { useEffect } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler): void => {
  useEffect(() => {
    let frame = 0;
    const handleScroll = (): void => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        onScroll();
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [onScroll]);
};

export default useScrollEvent;
