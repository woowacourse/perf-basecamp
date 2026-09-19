import { useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';

interface CustomCursorProps {
  text: string;
}

const CustomCursor = ({ text = '' }: CustomCursorProps): JSX.Element => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let pageX = 0;
    let pageY = 0;

    const render = (): void => {
      rafId = null;
      if (cursorRef.current === null) return;

      cursorRef.current.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
    };

    const handleMouseMove = (e: MouseEvent): void => {
      pageX = e.pageX;
      pageY = e.pageY;

      if (rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
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
