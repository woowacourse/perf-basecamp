import styles from './CustomCursor.module.css';
import { memo } from 'react';
interface CustomeCursorCharProps {
  char: string;
}

const CustomCursorChar = ({ char }: CustomeCursorCharProps) => {
  return <span className={styles.character}>{char}</span>;
};

export default memo(CustomCursorChar);
