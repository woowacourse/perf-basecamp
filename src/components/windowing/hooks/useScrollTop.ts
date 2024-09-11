import { RefObject, useEffect, useRef, useState } from 'react';

interface UseScrollTopReturn<T> {
  targetRef: RefObject<T>;
  scrollTop: number;
}

export const useScrollTop = <T extends HTMLElement>(): UseScrollTopReturn<T> => {
  const targetRef = useRef<T>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);

  useEffect(() => {
    const trackScrollTop = (e: Event) => {
      const target = e.currentTarget as T;
      setScrollTop(target.scrollTop);
    };

    targetRef.current?.addEventListener('scroll', trackScrollTop);

    return () => {
      targetRef.current?.removeEventListener('scroll', trackScrollTop);
    };
  }, []);

  return {
    targetRef,
    scrollTop
  };
};
