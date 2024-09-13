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
  const requestRef = useRef<number | null>(null);

  const updateCursorPosition = () => {
    if (cursorRef.current) {
      cursorRef.current.style.top = `${mousePosition.pageY}px`;
      cursorRef.current.style.left = `${mousePosition.pageX}px`;
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(updateCursorPosition);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePosition]);

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
