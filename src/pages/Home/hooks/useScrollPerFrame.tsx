import { useEffect, useEffectEvent } from 'react';

type ScrollHandler = () => void;

const useScrollPerFrame = (onScroll: ScrollHandler) => {
  const handleScroll = useEffectEvent(onScroll);

  useEffect(() => {
    let frameId = 0;

    const scheduleFrame = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => handleScroll());
    };

    window.addEventListener('scroll', scheduleFrame, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleFrame);
    };
  }, []);
};

export default useScrollPerFrame;
