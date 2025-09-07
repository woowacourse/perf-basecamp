import { useEffect, useRef, useState, useCallback } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  }, [isAnimating]);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${mousePosition.pageX}px, ${mousePosition.pageY}px, 0)`;
      handleMouseMove();
    }
  }, [mousePosition, handleMouseMove]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={cursorRef} className={`${styles.cursor} ${isAnimating ? styles.animating : ''}`}>
      {cursorTextChars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`${styles.character} ${isAnimating ? styles.wave : ''}`}
          style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default CustomCursor;
