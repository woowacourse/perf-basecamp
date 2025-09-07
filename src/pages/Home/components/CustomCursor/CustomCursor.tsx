import { useEffect, useRef, useCallback } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);

  const updateCursorPosition = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${mousePosition.pageX}px, ${mousePosition.pageY}px, 0)`;
    }
  }, [mousePosition.pageX, mousePosition.pageY]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(updateCursorPosition);
    return () => cancelAnimationFrame(animationFrame);
  }, [updateCursorPosition]);

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
