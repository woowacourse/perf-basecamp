import { useEffect, useEffectEvent } from 'react';

type PointerMoveHandler = (event: PointerEvent) => void;

const usePointerMove = (onMove: PointerMoveHandler) => {
  const handleMove = useEffectEvent(onMove);

  useEffect(() => {
    let frameId = 0;

    const scheduleFrame = (event: PointerEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => handleMove(event));
    };

    window.addEventListener('pointermove', scheduleFrame, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', scheduleFrame);
    };
  }, []);
};

export default usePointerMove;
