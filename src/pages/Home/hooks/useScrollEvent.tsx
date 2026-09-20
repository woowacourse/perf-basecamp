import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

/**
 * scroll 이벤트를 프레임당 한 번만 콜백으로 넘긴다.
 * 콜백을 ref로 들고 있어 리렌더마다 리스너를 다시 등록하지 않는다.
 */
const useScrollEvent = (onScroll: ScrollHandler) => {
  const onScrollRef = useRef(onScroll);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    let frameId: number | null = null;

    const flush = () => {
      frameId = null;

      onScrollRef.current();
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(flush);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);
};

export default useScrollEvent;
