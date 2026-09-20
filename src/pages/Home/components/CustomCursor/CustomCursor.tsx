import { memo, useCallback, useRef } from 'react';
import useMousePosition, { MousePosition } from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const cursorRef = useRef<HTMLDivElement>(null);

  // top/left를 바꾸면 Layout부터 다시 계산된다.
  // transform은 Composite 단계만 거치므로 Layout과 Paint를 건너뛴다.
  // state를 쓰지 않고 DOM을 직접 갱신해 리렌더도 발생시키지 않는다.
  const handleMove = useCallback(({ x, y }: MousePosition) => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  useMousePosition(handleMove);

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
