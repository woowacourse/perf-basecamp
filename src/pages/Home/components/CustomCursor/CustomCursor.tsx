import { useCallback, useRef } from 'react';
import useMousePosition, { MousePosition } from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

interface CustomCursorProps {
  text: string;
}

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;

  const updateMousePosition = useCallback((mousePosition: MousePosition) => {
    if (cursorRef.current != null) {
      if (mousePosition === null) return;
      cursorRef.current.style.transform = `translate(${mousePosition.pageX ?? 0}px, ${
        mousePosition.pageY ?? 0
      }px)`;
    }
  }, []);
  useMousePosition({ callback: updateMousePosition });
  const cursorRef = useRef<HTMLDivElement>(null);

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
