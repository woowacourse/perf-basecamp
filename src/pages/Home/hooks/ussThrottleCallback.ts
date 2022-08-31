import { useRef } from 'react';

function useThrottleCallback<Parameter extends any[]>(
  callback: (...rest: Parameter) => void,
  delay: number
) {
  const timerRef = useRef<NodeJS.Timeout>();
  const restRef = useRef<Parameter>();

  const timeoutCallback = () => {
    restRef.current && callback(...restRef.current);

    if (timerRef.current) {
      timerRef.current = undefined;
    }
  };

  return (...rest: Parameter): void => {
    restRef.current = rest;

    if (timerRef.current) return;

    callback(...rest);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(timeoutCallback, delay);
  };
}

export default useThrottleCallback;
