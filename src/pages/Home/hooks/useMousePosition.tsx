import { useEffect, useRef } from 'react';

export type MousePosition = { x: number; y: number };

type MouseMoveHandler = (position: MousePosition) => void;

/**
 * mousemove는 초당 40회 이상 발생한다. 이를 state로 받으면 그만큼 리렌더가 일어나므로
 * state 대신 콜백으로 좌표를 전달하고, requestAnimationFrame으로 프레임당 1회로 제한한다.
 */
const useMousePosition = (onMove: MouseMoveHandler) => {
  const handlerRef = useRef(onMove);
  handlerRef.current = onMove;

  useEffect(() => {
    let rafId: number | null = null;
    let latest: MousePosition = { x: 0, y: 0 };

    const flush = () => {
      rafId = null;
      handlerRef.current(latest);
    };

    const updateMousePosition = (e: MouseEvent) => {
      latest = { x: e.pageX, y: e.pageY };
      if (rafId === null) {
        rafId = requestAnimationFrame(flush);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
};

export default useMousePosition;
