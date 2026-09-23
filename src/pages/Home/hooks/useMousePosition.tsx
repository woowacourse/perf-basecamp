import { useEffect } from 'react';

export interface MousePosition {
  pageX: number;
  pageY: number;
}

type MousePositionHandler = (mousePosition: MousePosition) => void;

const useMousePosition = (onMousePositionChange: MousePositionHandler): void => {
  useEffect(() => {
    let animationFrameId: number | null = null;
    let latestPosition: MousePosition | null = null;

    const flush = (): void => {
      animationFrameId = null;

      if (latestPosition === null) return;

      onMousePositionChange(latestPosition);
    };

    const updateMousePosition = ({ pageX, pageY }: MouseEvent): void => {
      latestPosition = { pageX, pageY };

      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(flush);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onMousePositionChange]);
};

export default useMousePosition;
