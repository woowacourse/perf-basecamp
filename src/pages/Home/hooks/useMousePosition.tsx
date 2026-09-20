import { useEffect, useRef } from 'react';

export type MousePosition = {
  pageX: number;
  pageY: number;
};

type MousePositionHandler = (position: MousePosition) => void;

const useMousePosition = (onMove: MousePositionHandler) => {
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  // The handler is kept in a ref so the listener registers once instead of on every render.
  useEffect(() => {
    let frameId: number | null = null;
    let position: MousePosition = { pageX: 0, pageY: 0 };

    // mousemove fires more often than the browser paints, so updates are
    // coalesced into a single call per animation frame.
    const flushMousePosition = () => {
      frameId = null;
      onMoveRef.current(position);
    };

    const updateMousePosition = ({ pageX, pageY }: MouseEvent) => {
      position = { pageX, pageY };

      if (frameId === null) {
        frameId = requestAnimationFrame(flushMousePosition);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);
};

export default useMousePosition;
