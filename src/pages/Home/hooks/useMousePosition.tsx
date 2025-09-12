import { useEffect, useRef, useState, useCallback } from 'react';

export type MousePosition = {
  clientX: number;
  clientY: number;
};

const THROTTLE_INTERVAL = 32; // 약 30fps

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: 0,
    clientY: 0
  });

  const frameRef = useRef<number>();
  const prevMousePosition = useRef<MousePosition>(mousePosition);
  const lastUpdate = useRef(0);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const now = performance.now();

    const { clientX, clientY } = e;

    // 이전 위치와 동일하면 업데이트 스킵
    if (
      prevMousePosition.current.clientX === clientX &&
      prevMousePosition.current.clientY === clientY
    ) {
      return;
    }

    // 이전 RAF 취소
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // RAF를 사용하여 다음 프레임에서 상태 업데이트
    frameRef.current = requestAnimationFrame(() => {
      lastUpdate.current = now;
      setMousePosition({ clientX, clientY });
      prevMousePosition.current = { clientX, clientY };
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateMousePosition]);

  return mousePosition;
};

export default useMousePosition;
