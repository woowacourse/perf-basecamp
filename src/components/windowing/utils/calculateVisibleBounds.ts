interface CalculateVisibleBoundsParams {
  scrollTop: number;
  offsetTop: number;
  itemHeight: number;
  scrollerHeight: number;
  overscanCount: number;
}

interface CalculateVisibleBoundsReturn {
  start: number;
  end: number;
  scrollOffset?: number;
}

export const calculateVisibleBounds = ({
  scrollTop,
  offsetTop,
  itemHeight,
  scrollerHeight,
  overscanCount
}: CalculateVisibleBoundsParams): CalculateVisibleBoundsReturn => {
  const scrolledHeight = Math.max(scrollTop - offsetTop, 0);
  const scrolledItemCount = Math.floor(scrolledHeight / itemHeight);

  const start = scrolledItemCount;
  const visibleItemCount = Math.ceil(scrollerHeight / itemHeight) + 1;
  const end = start + visibleItemCount;

  const startOverscanCount = scrolledItemCount >= overscanCount ? overscanCount : scrolledItemCount;
  const scrollAdjustment = startOverscanCount * itemHeight;

  return {
    start: Math.max(start - startOverscanCount, 0),
    end: end + overscanCount,
    scrollOffset: itemHeight * scrolledItemCount - scrollAdjustment
  };
};
