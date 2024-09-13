import { useEffect } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  useEffect(() => {
    let requestScroll: number;

    const handleScroll = () => {
      requestScroll = requestAnimationFrame(onScroll);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (requestScroll) {
        cancelAnimationFrame(requestScroll);
      }
    };
  }, [onScroll]);
};

export default useScrollEvent;
