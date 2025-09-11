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

  const frameRef = useRef<number>();
  const latestEventRef = useRef<MouseEvent>();

  useEffect(() => {
    const update = () => {
      if (latestEventRef.current) {
        const { clientX, clientY, pageX, pageY, offsetX, offsetY } = latestEventRef.current;

        setMousePosition({
          clientX,
          clientY,
          pageX,
          pageY,
          offsetX,
          offsetY
        });
      }

      frameRef.current = undefined;
    };

    const onMouseMove = (e: MouseEvent) => {
      latestEventRef.current = e;

      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
