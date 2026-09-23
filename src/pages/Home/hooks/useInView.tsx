import { RefObject, useEffect, useRef, useState } from 'react';

interface UseInViewResult<T extends Element> {
  ref: RefObject<T>;
  isInView: boolean;
}

const useInView = <T extends Element>(rootMargin = '200px'): UseInViewResult<T> => {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (target === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return { ref, isInView };
};

export default useInView;
