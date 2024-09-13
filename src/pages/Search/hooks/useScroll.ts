import { UIEventHandler, useState } from 'react';

const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const handleScroll: UIEventHandler = (e) => {
    if (e.currentTarget === null) return;
    setScrollTop(Math.max((e.currentTarget as HTMLElement).scrollTop, 1));
  };
  return { scrollTop, handleScroll };
};

export default useScroll;
