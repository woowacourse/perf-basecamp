import { useCallback, useMemo } from 'react';
import createObserver from '../../../utils/createObservers';

const useIntersectionRef = (onIntersecting: () => void) => {
  const observer = useMemo(() => createObserver(onIntersecting), []);

  const intersectionRef = useCallback(<T extends Element>(instance: T | null) => {
    if (instance) observer.observe(instance);
  }, []);

  return intersectionRef;
};

export default useIntersectionRef;
