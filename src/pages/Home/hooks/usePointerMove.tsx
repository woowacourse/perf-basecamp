import { useEffect } from 'react';

type PointerMoveHandler = (event: PointerEvent) => void;

const usePointerMove = (onMove: PointerMoveHandler) => {
  useEffect(() => {
    let frameId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => onMove(event));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [onMove]);
};

export default usePointerMove;
