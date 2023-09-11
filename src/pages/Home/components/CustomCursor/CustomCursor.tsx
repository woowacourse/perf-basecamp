import { memo, useEffect, useRef } from 'react';
import useMousePosition from '../../hooks/useMousePosition';

import styles from './CustomCursor.module.css';
import CustomCursorChar from './CustomCursorChar';

type CustomCursorProps = {
  text: string;
};

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const [...cursorTextChars] = text;
  const mousePosition = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${mousePosition.pageX}px, ${mousePosition.pageY}px)`;
    }
  }, [mousePosition]);

  return (
    <div ref={cursorRef} className={styles.cursor}>
      {cursorTextChars.map((char, index) => (
        <CustomCursorChar key={index} char={char} />
      ))}
    </div>
  );
};

export default memo(CustomCursor);
