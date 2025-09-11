import { useCallback, useEffect, useRef } from 'react';

export type MousePosition = {
  pageX: number;
  pageY: number;
};

type MousePositionCallback = (position: MousePosition) => void;

const useOptimizedMousePosition = (callback: MousePositionCallback) => {
  const rafRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      callback({
        pageX: e.pageX,
        pageY: e.pageY
      });
    });
  }, [callback]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);
};

export default useOptimizedMousePosition;
