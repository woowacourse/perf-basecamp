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
    let rafId: number | null = null;
    let last: MousePosition | null = null;

    const handle = (e: MouseEvent) => {
      const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;
      last = { clientX, clientY, pageX, pageY, offsetX, offsetY };

      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (last != null) setMousePosition(last);
        last = null;
      });
    };

    window.addEventListener('mousemove', handle);
    return () => {
      window.removeEventListener('mousemove', handle);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
