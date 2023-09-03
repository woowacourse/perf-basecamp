import { useEffect, useRef } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const updateCursor = () => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${mousePosition.pageX}px,${mousePosition.pageY}px, 0)`;
    }

    animationFrameIdRef.current = requestAnimationFrame(updateCursor);
  };

  useEffect(() => {
    const updateCursorWithAnimationFrame = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePosition.pageX}px,${mousePosition.pageY}px, 0)`;
      }

      animationFrameIdRef.current = requestAnimationFrame(updateCursorWithAnimationFrame);
    };

    if (cursorRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(updateCursorWithAnimationFrame);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div ref={cursorRef} className={styles.cursor}>
      {cursorTextChars.map((char, index) => (
        <span key={index} className={styles.character}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default CustomCursor;
