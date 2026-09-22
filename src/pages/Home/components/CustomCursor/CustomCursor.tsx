import { useRef } from 'react';
import useMouseMoveEvent, { MousePosition } from '../../hooks/useMouseMoveEvent';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  useMouseMoveEvent(({ pageX, pageY }: MousePosition) => {
    const cursor = cursorRef.current;

    if (cursor === null) {
      return;
    }

    cursor.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
  });

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
