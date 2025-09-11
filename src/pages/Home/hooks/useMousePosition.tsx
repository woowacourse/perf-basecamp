import { useEffect, useRef, useState } from 'react';

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
  const lastMousePositionRef = useRef<MousePosition>({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  });

  useEffect(() => {
    let rafId: number | null = null;

    const updateMousePosition = (e: MouseEvent) => {
      lastMousePositionRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        offsetX: e.offsetX,
        offsetY: e.offsetY
      };

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const { clientX, clientY, pageX, pageY, offsetX, offsetY } = lastMousePositionRef.current;

        setMousePosition({
          clientX,
          clientY,
          pageX,
          pageY,
          offsetX,
          offsetY
        });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
