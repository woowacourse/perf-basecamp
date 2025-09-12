import { useEffect, useRef, useMemo, memo } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = memo(({ text = '' }: CustomCursorProps) => {
  // 문자 배열 메모이제이션
  const cursorTextChars = useMemo(() => [...text], [text]);

  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const prevTransform = useRef('');

  useEffect(() => {
    if (!cursorRef.current) return;

    const newTransform = `translate3d(${mousePosition.clientX}px, ${mousePosition.clientY}px, 0)`;

    // 이전 transform과 같으면 업데이트 스킵
    if (prevTransform.current === newTransform) {
      return;
    }

    // 이전 RAF 취소
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // RAF로 transform 업데이트 스케줄링
    frameRef.current = requestAnimationFrame(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = newTransform;
        prevTransform.current = newTransform;
      }
    });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [mousePosition]);

  // 문자 렌더링 메모이제이션
  const characters = useMemo(
    () =>
      cursorTextChars.map((char, index) => (
        <span key={index} className={styles.character}>
          {char}
        </span>
      )),
    [cursorTextChars]
  );

  return (
    <div ref={cursorRef} className={styles.cursor}>
      {characters}
    </div>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
