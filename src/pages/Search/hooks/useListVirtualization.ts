import useScroll from './useScroll';

interface Props {
  upperHeight: number;
  numItems: number;
  numOfItemsInFirst: number;
  itemHeight: number;
}

const useListVirtualization = ({ upperHeight, numItems, numOfItemsInFirst, itemHeight }: Props) => {
  const { scrollTop, handleScroll } = useScroll();

  const windowHeight = upperHeight + itemHeight * numOfItemsInFirst; // 할당된 높이공간
  const startIndex = Math.max(0, Math.floor((scrollTop - upperHeight) / itemHeight));
  const endIndex =
    Math.min(
      numItems - 1,
      Math.max(0, Math.floor((scrollTop + windowHeight - upperHeight) / itemHeight))
    ) + 2;
  const innerStartHeight = Math.max(startIndex - 1, 0) * itemHeight;
  const innerHeight = numItems * itemHeight; // 아이템들의 높이공간

  return {
    handleScroll,
    startIndex,
    endIndex,
    windowHeight,
    innerStartHeight,
    innerHeight
  };
};

export default useListVirtualization;
