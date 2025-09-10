import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

type CustomCursorProps = { text?: string };

const CustomCursor = ({ text = '' }: CustomCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden>
      {text.split('').map((char, i) => (
        <span key={i} className={styles.character}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default CustomCursor;
