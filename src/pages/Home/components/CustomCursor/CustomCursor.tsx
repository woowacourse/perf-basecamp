import { useCallback, useRef } from 'react';
import useOptimizedMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(({ pageX, pageY }: { pageX: number; pageY: number }) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
    }
  }, []);

  useOptimizedMousePosition(updatePosition);

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
