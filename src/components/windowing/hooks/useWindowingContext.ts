import { createContext, useContext } from 'react';

interface WindowingContextProps {
  scrollerHeight: number;
  scrollTop: number;
}

export const WindowingContext = createContext<WindowingContextProps>({
  scrollerHeight: 0,
  scrollTop: 0
});

export const useWindowingContext = (): WindowingContextProps => {
  const context = useContext(WindowingContext);

  if (!context) {
    throw new Error('useWindowingContext는 WindowingContext Provider 내부에서 실행되어야 합니다.');
  }

  return context;
};
