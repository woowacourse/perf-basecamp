import { useCallback, useRef } from 'react';
import useMousePosition, { MousePosition } from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  const moveCursor = useCallback(({ pageX, pageY }: MousePosition) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
    }
  }, []);

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
