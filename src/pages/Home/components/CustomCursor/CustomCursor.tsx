import { useRef } from 'react';
import useMousePosition, { MousePosition } from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

interface CustomCursorProps {
  text: string;
}

const CustomCursor = ({ text = '' }: CustomCursorProps): JSX.Element => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  const moveCursor = ({ pageX, pageY }: MousePosition): void => {
    const cursor = cursorRef.current;

    if (cursor === null) return;

    cursor.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
  };

  useMousePosition(moveCursor);

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
