import { useEffect, useState, useRef, useCallback } from 'react';

export type MousePosition = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  offsetX: number;
  offsetY: number;
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const rafId = useRef<number | null>(null);
  const lastKnownPosition = useRef<MousePosition>(mousePosition);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;
    lastKnownPosition.current = {
      clientX,
      clientY,
      pageX,
      pageY,
      offsetX,
      offsetY
    };
  }, []);

  const animationFrameCallback = useCallback(() => {
    setMousePosition(lastKnownPosition.current);
    rafId.current = requestAnimationFrame(animationFrameCallback);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);
    rafId.current = requestAnimationFrame(animationFrameCallback);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updateMousePosition, animationFrameCallback]);

  return mousePosition;
};

export default useMousePosition;
