import { useEffect, useRef, useState } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (mousePosition.pageX !== 0 || mousePosition.pageY !== 0) {
      setIsReady(true);
    }
  }, [mousePosition]);

  useEffect(() => {
    if (cursorRef.current && isReady) {
      cursorRef.current.style.transform = `translate3d(${mousePosition.clientX}px, ${mousePosition.clientY}px, 0)`;
    }
  }, [mousePosition, isReady]);

  if (!isReady) {
    return null;
  }

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
