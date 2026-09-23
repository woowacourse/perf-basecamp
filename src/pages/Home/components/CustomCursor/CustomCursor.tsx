import { useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (cursor === null) return;

    let frameId: number | null = null;
    let pageX = 0;
    let pageY = 0;

    const updatePosition = (event: MouseEvent): void => {
      pageX = event.pageX;
      pageY = event.pageY;

      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${pageX}px, ${pageY}px)`;
        frameId = null;
      });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

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
