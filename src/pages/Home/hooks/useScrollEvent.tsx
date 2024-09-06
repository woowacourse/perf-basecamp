import { useEffect } from 'react';
import { debounce } from '../../../utils/debounce';

type ScrollHandler = () => void;
const DEBOUNCE_DELAY = 50;

const useScrollEvent = (onScroll: ScrollHandler) => {
  useEffect(() => {
    const debouncedScrollHandler = debounce(onScroll, DEBOUNCE_DELAY);

    const handleScroll = (event: Event) => {
      debouncedScrollHandler();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
};

export default useScrollEvent;
