import { RefObject, useEffect } from 'react';

const useMousePosition = (cursorRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    let frameId: number | null = null;
    let clientX = 0;
    let clientY = 0;

    const updateCursor = () => {
      if (cursorRef.current !== null) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      frameId = null;
    };

    const updateMousePosition = (event: MouseEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (frameId === null) frameId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [cursorRef]);
};

export default useMousePosition;
