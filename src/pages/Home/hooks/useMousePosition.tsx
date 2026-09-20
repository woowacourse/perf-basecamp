import { useEffect, useState } from 'react';

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

  useEffect(() => {
    let animationFrameId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    const flush = () => {
      animationFrameId = null;

      if (latestEvent === null) return;

      const { clientX, clientY, pageX, pageY, offsetX, offsetY } = latestEvent;

      setMousePosition({
        clientX,
        clientY,
        pageX,
        pageY,
        offsetX,
        offsetY
      });
    };

    const updateMousePosition = (e: MouseEvent) => {
      latestEvent = e;

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
  }, []);

  return mousePosition;
};

export default useMousePosition;
