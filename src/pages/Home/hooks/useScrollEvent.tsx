import { useEffect } from 'react';
import Throttle from '../../../utils/throttle';

const useScrollEvent = (onScroll: (e: Event) => void) => {
  useEffect(() => {
    const handler = Throttle.withRequestAnimationFrame(onScroll);

    window.addEventListener('scroll', handler);

    return () => window.removeEventListener('scroll', handler);
  }, []);
};

export default useScrollEvent;
