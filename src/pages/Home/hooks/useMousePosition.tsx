import { useEffect, useRef } from 'react';

export interface MousePosition {
  pageX: number;
  pageY: number;
}

type MousePositionHandler = (position: MousePosition) => void;

const useMousePosition = (onMove: MousePositionHandler): void => {
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    let frameId: number | null = null;
    let position: MousePosition = { pageX: 0, pageY: 0 };

    const flushMousePosition = (): void => {
      frameId = null;
      onMoveRef.current(position);
    };

    const updateMousePosition = ({ pageX, pageY }: MouseEvent): void => {
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
