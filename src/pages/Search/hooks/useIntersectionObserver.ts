import { RefObject, useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverResult<T extends Element> {
  ref: RefObject<T>;
  isIntersecting: boolean;
}

const useIntersectionObserver = <T extends Element>(
  rootMargin = '0px'
): UseIntersectionObserverResult<T> => {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (isIntersecting) return;

    const element = ref.current;
    if (element === null || !('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isIntersecting, rootMargin]);

  return { ref, isIntersecting };
};

export default useIntersectionObserver;
