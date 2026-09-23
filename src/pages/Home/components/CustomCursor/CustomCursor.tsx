import { useEffect, useRef } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

interface CustomCursorProps {
  text: string;
}

const CustomCursor = ({ text = '' }: CustomCursorProps): JSX.Element => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorRef.current != null) {
      cursorRef.current.style.top = `${mousePosition.pageY ?? 0}px`;
      cursorRef.current.style.left = `${mousePosition.pageX ?? 0}px`;
    }
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
