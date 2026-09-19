import { useEffect, useRef } from 'react';

type ScrollHandler = () => void;

const useScrollEvent = (onScroll: ScrollHandler) => {
  const savedHandler = useRef(onScroll);

  useEffect(() => {
    savedHandler.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    const handleScroll = () => savedHandler.current();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

export default useScrollEvent;
