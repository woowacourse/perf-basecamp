import { useEffect, useState, useCallback, useRef } from 'react';

export type MousePosition = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0
  });

  const rafId = useRef<number | null>(null);
  const lastPosition = useRef<MousePosition>({ clientX: 0, clientY: 0, pageX: 0, pageY: 0 });
  const isUpdating = useRef(false);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY, pageX, pageY } = e;

    // 위치 변화가 미미하면 무시 (1px 이하)
    const deltaX = Math.abs(clientX - lastPosition.current.clientX);
    const deltaY = Math.abs(clientY - lastPosition.current.clientY);

    if (deltaX < 1 && deltaY < 1) {
      return;
    }

    // 이미 업데이트 중이면 무시
    if (isUpdating.current) {
      return;
    }

    isUpdating.current = true;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      lastPosition.current = { clientX, clientY, pageX, pageY };
      setMousePosition({ clientX, clientY, pageX, pageY });
      isUpdating.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updateMousePosition]);

  return mousePosition;
};

export default useMousePosition;
