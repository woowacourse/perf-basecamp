import { useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseCursor = (event: MouseEvent) => {
      requestAnimationFrame(() => {
        if (!cursorRef.current) return;

        cursorRef.current.style.transform = `translate(${event.pageX}px, ${event.pageY}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseCursor);

    return () => window.removeEventListener('mousemove', handleMouseCursor);
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
