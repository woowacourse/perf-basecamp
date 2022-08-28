import { useEffect } from 'react';

const useScrollEvent = (onScroll: (e: Event) => void) => {
  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);
};

export default useScrollEvent;
