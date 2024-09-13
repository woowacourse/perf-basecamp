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

  useEffect(() => {
    let animationFrameId: any;

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePosition.pageX}px, ${mousePosition.pageY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    // 최초 실행
    animationFrameId = requestAnimationFrame(updateCursorPosition);

    // 컴포넌트 언마운트 시 requestAnimationFrame 해제
    return () => {
      cancelAnimationFrame(animationFrameId);
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
