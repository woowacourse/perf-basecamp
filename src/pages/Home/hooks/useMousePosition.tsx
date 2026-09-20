import { useEffect, useRef } from 'react';

export type MousePosition = Pick<
  MouseEvent,
  'clientX' | 'clientY' | 'pageX' | 'pageY' | 'offsetX' | 'offsetY'
>;

type MousePositionHandler = (mousePosition: MousePosition) => void;

/**
 * mousemove 좌표를 프레임당 한 번만 콜백으로 넘긴다.
 * setState를 쓰지 않으므로 마우스 이동이 React 렌더를 유발하지 않는다.
 */
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
