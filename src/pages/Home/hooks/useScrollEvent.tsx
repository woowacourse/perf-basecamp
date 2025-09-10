import { useEffect, useRef } from 'react';

type Measure<T> = () => T;
type Mutate<T> = (snap: T) => void;

export default function useScrollEvent<T>(MeasureFn: Measure<T>, MutateFn?: Mutate<T>) {
  const ticking = useRef(false);
  const hasMeasureMutate = typeof MutateFn === 'function';
  const measure: Measure<T> = hasMeasureMutate ? MeasureFn : () => undefined as unknown as T;
  const mutate: Mutate<T> = hasMeasureMutate ? MutateFn : MeasureFn;

  useEffect(() => {
    let lastSnap: T;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      lastSnap = measure();

      requestAnimationFrame(() => {
        mutate(lastSnap);
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [measure, mutate]);
}
