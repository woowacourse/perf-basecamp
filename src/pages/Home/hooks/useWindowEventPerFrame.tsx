import { useEffect, useEffectEvent } from 'react';

type WindowEventName = keyof WindowEventMap;

const useWindowEventPerFrame = <Name extends WindowEventName>(
  name: Name,
  onEvent: (event: WindowEventMap[Name]) => void
) => {
  const handleEvent = useEffectEvent(onEvent);

  useEffect(() => {
    let frameId = 0;

    const scheduleFrame = (event: WindowEventMap[Name]) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => handleEvent(event));
    };

    window.addEventListener(name, scheduleFrame, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener(name, scheduleFrame);
    };
  }, [name]);
};

export default useWindowEventPerFrame;
