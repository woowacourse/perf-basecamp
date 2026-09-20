import { ReactNode } from 'react';

import styles from './GifGrid.module.css';

type GifGridProps = {
  children: ReactNode;
};

const GifGrid = ({ children }: GifGridProps) => {
  return <div className={styles.gifGrid}>{children}</div>;
};

export default GifGrid;
