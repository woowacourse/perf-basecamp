import { useRef } from 'react';

const useAnimationFrame = () => {
  const ref = useRef<number>();

  const request = (callback: CallableFunction) => {
    if (ref.current) {
      cancelAnimationFrame(ref.current);
    }
    ref.current = requestAnimationFrame(() => {
      callback();
      ref.current = undefined;
    });
  };

  return request;
};

export default useAnimationFrame;
