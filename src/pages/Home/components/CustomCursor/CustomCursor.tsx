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

  // position: fixed에 맞게 clientX/clientY 사용
  useEffect(() => {
    if (cursorRef.current) {
      const cursor = cursorRef.current;
      // 커서 중앙 정렬 (before와 텍스트 모두 포함)
      const offsetX = 12; // before의 반지름
      const offsetY = 12; // before의 반지름
      cursor.style.transform = `translate3d(${(mousePosition.clientX ?? 0) - offsetX}px, ${
        (mousePosition.clientY ?? 0) - offsetY
      }px, 0)`;
    }
  }, [mousePosition]);

  return (
    <div ref={cursorRef} className={styles.cursor}>
      {/* 각 문자에 .character, .wave, delay 적용 */}
      {cursorTextChars.map((char, index) => (
        <span
          key={index}
          className={`${styles.character} ${styles.wave}`}
          style={{ ['--delay' as any]: `${index * 0.1}s` }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default CustomCursor;
