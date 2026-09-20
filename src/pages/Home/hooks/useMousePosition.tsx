import { useEffect } from 'react';

export type MousePosition = Partial<MouseEvent>;

interface Options {
  callback: (mousePosition: MousePosition) => void;
}

const useMousePosition = ({ callback }: Options): void => {
  const updateMousePosition = (e: MouseEvent): void => {
    const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;

    callback(e);
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
};

export default useMousePosition;
