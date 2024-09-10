import { useSyncExternalStore } from 'react';

export type MousePosition = Partial<MouseEvent>;

const createMousePositionStore = () => {
  let mousePosition: MousePosition = {
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  };

  const listeners = new Set<() => void>();

  const updateMousePosition = (e: MouseEvent) => {
    const { clientX, clientY, pageX, pageY, offsetX, offsetY } = e;
    mousePosition = {
      clientX,
      clientY,
      pageX,
      pageY,
      offsetX,
      offsetY
    };
    listeners.forEach((listener) => listener());
  };

  window.addEventListener('mousemove', updateMousePosition);

  return {
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    getSnapshot: () => mousePosition,
    getServerSnapshot: () => mousePosition
  };
};

const mousePositionStore = createMousePositionStore();

const useMousePosition = () => {
  return useSyncExternalStore(
    mousePositionStore.subscribe,
    mousePositionStore.getSnapshot,
    mousePositionStore.getServerSnapshot
  );
};

export default useMousePosition;
