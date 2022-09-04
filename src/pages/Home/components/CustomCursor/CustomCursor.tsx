import { useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  const updateCursorPosition = (e: MouseEvent) => {
    if (!cursorRef.current) return;
    const { current: $cursor } = cursorRef;
    const { pageX, pageY } = e;
    const cursorBefore = window.getComputedStyle($cursor, ':before');
    const { width: widthPx, height: heightPx } = cursorBefore;
    const width = parseInt(widthPx, 10);
    const height = parseInt(heightPx, 10);
    const xCoordinate = pageX - Math.floor(width / 2) + 'px';
    const yCoordinate = pageY - Math.floor(height / 2) + 'px';
    cursorRef.current.style.transform = `translate3d(${xCoordinate},${yCoordinate}, 0px)`;
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateCursorPosition);
    return () => window.removeEventListener('mousemove', updateCursorPosition);
  }, [cursorRef.current, updateCursorPosition]);

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
