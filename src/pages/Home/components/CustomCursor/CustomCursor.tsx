import { useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';
import useAnimationFrame from '../../../Search/hooks/useAnimationFrame';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestAnimationFrame = useAnimationFrame();

  useEffect(() => {
    const updateMousePosition = (event: MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) {
        return;
      }

      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${event.pageX}px, ${event.pageY}px)`;
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

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
