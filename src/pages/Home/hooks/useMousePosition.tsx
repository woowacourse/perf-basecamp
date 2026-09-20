import { useEffect, useRef } from 'react';

export type MousePosition = Partial<MouseEvent>;

interface Options {
  callback: (mousePosition: MousePosition) => void;
}

const useMousePosition = ({ callback }: Options): void => {
  const frameRef = useRef<number | null>(null);
  const mouseRef = useRef<MousePosition | null>(null);
  const updateMousePosition = (e: MouseEvent): void => {
    mouseRef.current = e;

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (mouseRef.current !== null) callback(mouseRef.current);
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
};

export default useMousePosition;
