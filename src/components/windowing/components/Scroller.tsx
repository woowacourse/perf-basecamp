import type { PropsWithChildren } from 'react';
import { WindowingContext } from '../hooks/useWindowingContext';
import { useScrollTop } from '../hooks/useScrollTop';

interface ScrollerProps {
  height: number;
  className?: string;
}

const Scroller = ({ height, className, children }: PropsWithChildren<ScrollerProps>) => {
  const { targetRef, scrollTop } = useScrollTop<HTMLDivElement>();

  return (
    <div ref={targetRef} style={{ overflow: 'auto', height }} className={className}>
      <WindowingContext.Provider value={{ scrollerHeight: height, scrollTop }}>
        {children}
      </WindowingContext.Provider>
    </div>
  );
};

export default Scroller;
