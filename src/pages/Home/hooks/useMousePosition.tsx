import { useEffect, useState } from 'react';

export type MousePosition = Partial<MouseEvent>;

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    pageX: 0,
    pageY: 0
  });

  const updateMousePosition = (e: MouseEvent) => {
    const { pageX, pageY } = e;

    setMousePosition({
      pageX,
      pageY
    });
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
