import { useState } from 'react';

type VirtualizedListProps = {
  numItems: number;
  itemHeight: number;
  renderItem: (item: {
    index: number;
    style: { position: string; top: string; width: string };
  }) => React.ReactNode;
  windowHeight: number;
};
//
const VirtualizedList = ({
  numItems,
  itemHeight,
  renderItem,
  windowHeight
}: VirtualizedListProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const innerHeight = numItems * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(numItems - 1, Math.floor((scrollTop + windowHeight) / itemHeight));

  const items = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      renderItem({
        index: i,
        style: {
          position: 'absolute',
          top: `${i * itemHeight}px`,
          width: '100%'
        }
      })
    );
  }
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div style={{ overflowY: 'scroll', height: `${windowHeight}px` }} onScroll={onScroll}>
      <div style={{ position: 'relative', height: `${innerHeight}px` }}>{items}</div>
    </div>
  );
};

export default VirtualizedList;
