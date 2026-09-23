import { useCallback, useEffect, useRef } from 'react';
import { clamp } from '../../../../utils/number';
import useScrollEvent from '../../hooks/useScrollEvent';

import pathImage from '../../assets/scroll-path.svg';
import styles from './AnimatedPath.module.css';

interface AnimatedPathProps {
  wrapperRef: React.RefObject<HTMLElement>;
}

const TOP_PERCENTAGE_OF_DRAW_POINT = 0.8;

const AnimatedPath = ({ wrapperRef }: AnimatedPathProps): JSX.Element => {
  const revealRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const geometry = useRef({ top: 0, height: 1, viewportHeight: 0, reducedMotion: false });
  const previousOffset = useRef(-1);

  const drawPath = useCallback((): void => {
    const reveal = revealRef.current;
    const image = imageRef.current;
    if (reveal === null || image === null) return;

    const { top, height, viewportHeight, reducedMotion } = geometry.current;
    const drawPointY = window.scrollY + viewportHeight * TOP_PERCENTAGE_OF_DRAW_POINT;
    const offset = reducedMotion ? 0 : clamp(1 - (drawPointY - top) / height, 0, 1);
    if (offset !== previousOffset.current) {
      // Opposite transforms keep the drawing stationary while revealing it.
      // The SVG is rasterized once instead of repainting its stroke on every frame.
      reveal.style.transform = `translate3d(0, ${-offset * 100}%, 0)`;
      image.style.transform = `translate3d(0, ${offset * 100}%, 0)`;
      previousOffset.current = offset;
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper === null) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const measure = (): void => {
      const rect = wrapper.getBoundingClientRect();
      geometry.current = {
        top: rect.top + window.scrollY,
        height: Math.max(rect.height, 1),
        viewportHeight: window.innerHeight,
        reducedMotion: reducedMotion.matches
      };
      drawPath();
    };
    // Read layout only at mount/resize, never in the scroll handler.
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    window.addEventListener('resize', measure);
    reducedMotion.addEventListener('change', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      reducedMotion.removeEventListener('change', measure);
    };
  }, [wrapperRef, drawPath]);

  useScrollEvent(drawPath);

  return (
    <div className={styles.animatedPath} aria-hidden="true">
      <div ref={revealRef} className={styles.reveal}>
        <img
          ref={imageRef}
          className={styles.pathImage}
          src={pathImage}
          width="924"
          height="1691"
          alt=""
          decoding="async"
        />
      </div>
    </div>
  );
};

export default AnimatedPath;
