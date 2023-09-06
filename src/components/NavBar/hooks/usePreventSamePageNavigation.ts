import { MouseEvent } from 'react';
import { ROUTE_PATH } from '../../../constants/pageRoute';
import { useLocation } from 'react-router';

type Page = (typeof ROUTE_PATH)[keyof typeof ROUTE_PATH];

const usePreventSamePageNavigation = () => {
  const location = useLocation().pathname;

  const preventSamePageNavigation = (e: MouseEvent, pageToMove: Page) => {
    if (location === pageToMove) e.preventDefault();
  };

  return { preventSamePageNavigation };
};

export default usePreventSamePageNavigation;
