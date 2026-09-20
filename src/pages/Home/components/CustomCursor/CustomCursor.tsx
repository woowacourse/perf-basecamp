import { useRef } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

interface CustomCursorProps {
  text: string;
}

const CustomCursor = ({ text = '' }: CustomCursorProps): JSX.Element => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);
  useMousePosition(cursorRef);

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      {cursorTextChars.map((char, index) => (
        <span key={index} className={styles.character}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default CustomCursor;
