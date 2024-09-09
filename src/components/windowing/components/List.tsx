import { useWindowingContext } from '../hooks/useWindowingContext';
import { calculateVisibleBounds } from '../utils/calculateVisibleBounds';

interface WindowingListProps<T> {
  dataList: T[];
  itemHeight: number;
  offsetTop: number;
  overscanCount?: number;
  children: ({
    index,
    data,
    style
  }: {
    index: number;
    data: T;
    style: Record<string, string | number>;
  }) => React.ReactNode;
}

const List = <T,>({
  itemHeight,
  dataList,
  offsetTop,
  overscanCount = 3,
  children
}: WindowingListProps<T>) => {
  const { scrollerHeight, scrollTop } = useWindowingContext();

  const { start, end, scrollOffset } = calculateVisibleBounds({
    scrollTop,
    offsetTop,
    itemHeight,
    scrollerHeight,
    overscanCount
  });

  const estimatedHeight = itemHeight * dataList.length;

  return (
    <ul style={{ height: estimatedHeight, transform: `translateY(${scrollOffset}px)` }}>
      {dataList.slice(start, end).map((data, index) => {
        const style = {
          height: itemHeight
        };

        return children({ index, data, style });
      })}
    </ul>
  );
};

export default List;
