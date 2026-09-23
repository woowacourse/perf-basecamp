import { useRef } from 'react';
import usePointerMovePerFrame from '../../hooks/usePointerMovePerFrame';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  const moveCursor = (event: PointerEvent) => {
    if (cursorRef.current !== null) {
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }
  };

  usePointerMovePerFrame(moveCursor);

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
