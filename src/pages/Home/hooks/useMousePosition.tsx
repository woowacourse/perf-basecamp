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

  const frameRef = useRef<number | null>(null);

  const updateMousePosition = (e: MouseEvent) => {
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(() => {
        const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;
        setMousePosition({ clientX, clientY, pageX, pageY, offsetX, offsetY });
        frameRef.current = null;
      });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
