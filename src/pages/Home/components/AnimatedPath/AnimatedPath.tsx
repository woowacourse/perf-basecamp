import { useRef, useEffect, useCallback } from 'react';
import { clamp } from '../../../../utils/number';
import animatedPathImage from '../../../../assets/images/animated-path.svg';
import useScrollEvent from '../../hooks/useScrollEvent';

import styles from './AnimatedPath.module.css';

type AnimatedPathProps = {
  wrapperRef: React.RefObject<HTMLElement>;
};

const TOP_PERCENTAGE_OF_DRAW_POINT = 0.8; // 현재 보이는 화면의 80% 지점에서 선이 그려지는 게 보이도록 함
const PATH_LENGTH = 8254.925;

const AnimatedPath = ({ wrapperRef }: AnimatedPathProps) => {
  const pathRef = useRef<SVGUseElement>(null);

  const drawPath = useCallback(() => {
    const wrapper = wrapperRef.current;
    const path = pathRef.current;

    if (wrapper === null || path === null) {
      return;
    }

    const drawPointY = window.scrollY + window.innerHeight * TOP_PERCENTAGE_OF_DRAW_POINT;
    const scrollRatio = (drawPointY - wrapper.offsetTop) / wrapper.offsetHeight;
    const currentScrollOffset = PATH_LENGTH - PATH_LENGTH * scrollRatio;
    const strokeOffset = clamp(currentScrollOffset, 0, PATH_LENGTH);

    path.setAttribute('stroke-dashoffset', String(strokeOffset));
  }, [wrapperRef]);

  useEffect(() => {
    drawPath();
  }, [drawPath]);

  useScrollEvent(drawPath);

  return (
    <svg
      className={styles.animatedPath}
      width="924"
      height="1691"
      viewBox="0 0 924 1691"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use
        ref={pathRef}
        href={`${animatedPathImage}#animated-path`}
        stroke="white"
        strokeDasharray={PATH_LENGTH}
        strokeDashoffset={PATH_LENGTH}
      />
    </svg>
  );
};

export default AnimatedPath;
