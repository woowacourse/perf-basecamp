import { useEffect, useRef, useCallback } from 'react';
import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

export type MousePosition = Partial<MouseEvent>;

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePositionRef = useRef<MousePosition>({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  });
  const cursorRef = useRef<HTMLDivElement>(null);

  const updateCursorPosition = useCallback(
    (e: MouseEvent) => {
      const { pageX, pageY } = e;

      // ref 값 업데이트
      mousePositionRef.current = {
        ...mousePositionRef.current,
        pageX,
        pageY
      };

      // 커서 위치 업데이트
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
      }
    },
    [mousePositionRef]
  );

  useEffect(() => {
    window.addEventListener('mousemove', updateCursorPosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, [updateCursorPosition]);

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
