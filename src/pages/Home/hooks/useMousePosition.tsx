import { useEffect, useState, useCallback, useRef } from 'react';

export type MousePosition = Partial<MouseEvent>;

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const rafRef = useRef<number>();

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({
        clientX,
        clientY,
        pageX,
        pageY,
        offsetX,
        offsetY
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateMousePosition]);

  return mousePosition;
};

export default useMousePosition;
