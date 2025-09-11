import { useCallback, useEffect, useRef, useState } from 'react';

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

  const animationRef = useRef<number>();

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
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
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateMousePosition]);

  return mousePosition;
};

export default useMousePosition;
