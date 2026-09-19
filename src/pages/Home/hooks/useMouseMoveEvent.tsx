import { useEffect, useRef } from 'react';

export type MousePosition = {
  pageX: number;
  pageY: number;
};

type MouseMoveHandler = (position: MousePosition) => void;

const useMouseMoveEvent = (onMouseMove: MouseMoveHandler) => {
  const savedHandler = useRef(onMouseMove);

  useEffect(() => {
    savedHandler.current = onMouseMove;
  }, [onMouseMove]);

  // 핸들러를 ref로 우회해 의존성을 비워둔다. (useScrollEvent와 동일한 이유)
  useEffect(() => {
    let rafId = 0;
    let pageX = 0;
    let pageY = 0;

    const notify = () => {
      rafId = 0;
      savedHandler.current({ pageX, pageY });
    };

    const handleMouseMove = (event: MouseEvent) => {
      pageX = event.pageX;
      pageY = event.pageY;

      // 마우스 폴링 주기는 화면 주사율보다 빠를 수 있으므로 프레임당 한 번만 통지한다.
      if (rafId === 0) {
        rafId = requestAnimationFrame(notify);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);

      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
};

export default useMouseMoveEvent;
