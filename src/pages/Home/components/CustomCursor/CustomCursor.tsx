import { memo, useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let nextPosition = { x: 0, y: 0 };

    const updateCursor = (event: PointerEvent) => {
      nextPosition = { x: event.clientX, y: event.clientY };

      if (animationFrameId !== null) return;

      animationFrameId = requestAnimationFrame(() => {
        cursorRef.current?.style.setProperty(
          'transform',
          `translate3d(${nextPosition.x}px, ${nextPosition.y}px, 0)`
        );
        animationFrameId = null;
      });
    };

    window.addEventListener('pointermove', updateCursor, { passive: true });

    return () => {
      window.removeEventListener('pointermove', updateCursor);

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
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

export default memo(CustomCursor);
