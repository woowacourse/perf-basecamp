import { useEffect, useRef } from 'react';

export type MousePosition = Pick<
  MouseEvent,
  'clientX' | 'clientY' | 'pageX' | 'pageY' | 'offsetX' | 'offsetY'
>;

type MousePositionHandler = (mousePosition: MousePosition) => void;

const useMousePosition = (onMove: MousePositionHandler) => {
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    let frameId: number | null = null;
    let latestPosition: MousePosition | null = null;

    const flush = () => {
      frameId = null;

      if (latestPosition) {
        onMoveRef.current(latestPosition);
      }
    };

    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;
      latestPosition = { clientX, clientY, pageX, pageY, offsetX, offsetY };

      if (frameId === null) {
        frameId = requestAnimationFrame(flush);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);
};

export default useMousePosition;
