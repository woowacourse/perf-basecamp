import { useEffect, useRef } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef(mousePosition);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    mousePositionRef.current = mousePosition;
  }, [mousePosition]);

  useEffect(() => {
    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mousePositionRef.current.pageX}px, ${mousePositionRef.current.pageY}px)`;
      }
      animationFrameIdRef.current = requestAnimationFrame(updatePosition);
    };

    animationFrameIdRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
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
