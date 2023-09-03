import { useCallback, useEffect, useState } from 'react';

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

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;
    setMousePosition({
      clientX,
      clientY,
      pageX,
      pageY,
      offsetX,
      offsetY
    });
  }, []);

  useEffect(() => {
    const handleThrottleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e);
    };

    window.addEventListener('mousemove', handleThrottleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleThrottleMouseMove);
    };
  }, [updateMousePosition]);

  return mousePosition;
};

export default useMousePosition;
