import { useEffect, useRef } from 'react';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;

  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({
    pageX: 0,
    pageY: 0
  });
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCursorPosition = () => {
      if (cursorRef.current !== null) {
        const { pageX, pageY } = mousePositionRef.current;

        cursorRef.current.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
      }

      animationFrameIdRef.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current.pageX = event.pageX;
      mousePositionRef.current.pageY = event.pageY;

      if (animationFrameIdRef.current !== null) {
        return;
      }

      animationFrameIdRef.current = window.requestAnimationFrame(updateCursorPosition);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);

      if (animationFrameIdRef.current !== null) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
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

export default CustomCursor;
