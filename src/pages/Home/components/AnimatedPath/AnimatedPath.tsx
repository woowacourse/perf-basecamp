import { useEffect, useRef } from 'react';
import { clamp } from '../../../../utils/number';

import styles from './AnimatedPath.module.css';

type AnimatedPathProps = {
  wrapperRef: React.RefObject<HTMLElement>;
};

const TOP_PERCENTAGE_OF_DRAW_POINT = 0.8; // 현재 보이는 화면의 80% 지점에서 선이 그려지는 게 보이도록 함

const AnimatedPath = ({ wrapperRef }: AnimatedPathProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const path = pathRef.current;

    if (!wrapper || !path) {
      return;
    }

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    let animationFrameId: number | null = null;

    const drawPath = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        const drawPointY = window.scrollY + window.innerHeight * TOP_PERCENTAGE_OF_DRAW_POINT;
        const scrollRatio = (drawPointY - wrapper.offsetTop) / wrapper.offsetHeight;
        const currentScrollOffset = pathLength - pathLength * scrollRatio;

        path.style.strokeDashoffset = `${clamp(currentScrollOffset, 0, pathLength)}`;
        animationFrameId = null;
      });
    };

    drawPath();

    window.addEventListener('scroll', drawPath, { passive: true });
    window.addEventListener('resize', drawPath);

    return () => {
      window.removeEventListener('scroll', drawPath);
      window.removeEventListener('resize', drawPath);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [wrapperRef]);

  return (
    <svg
      className={styles.animatedPath}
      width="924"
      height="1691"
      viewBox="0 0 924 1691"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path ref={pathRef} d="기존 경로 값 그대로" stroke="white" />
    </svg>
  );
};

export default AnimatedPath;
