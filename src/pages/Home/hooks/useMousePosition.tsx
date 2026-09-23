import { useEffect } from 'react';
import type { RefObject } from 'react';

// Pointer movement is visual only: update the compositor without React renders.
const useMousePosition = (cursorRef: RefObject<HTMLDivElement>): void => {
  useEffect(() => {
    const cursor = cursorRef.current;
    const media = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    if (cursor === null) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const updatePosition = (): void => {
      frame = 0;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.style.opacity = '1';
    };
    const handleMove = (event: PointerEvent): void => {
      if (!media.matches || event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (frame === 0) frame = requestAnimationFrame(updatePosition);
    };
    const hide = (): void => {
      cancelAnimationFrame(frame);
      frame = 0;
      cursor.style.opacity = '0';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    media.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      media.removeEventListener('change', hide);
    };
  }, [cursorRef]);
};

export default useMousePosition;
