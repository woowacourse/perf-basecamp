import { GifImageModel } from '../../../../models/image/gifImage';
import { memo } from 'react';
import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <img className={styles.gifImage} src={imageUrl} />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default GifItem;

export const MemorizedGifItem = memo(
  GifItem,
  ({ imageUrl: prevImageUrl, title: prevTitle }, { imageUrl: nextImageUrl, title: nextTitle }) => {
    return prevImageUrl === nextImageUrl && prevTitle === nextTitle;
  }
);

export const GifItemSkeleton = () => {
  return (
    <div className={styles.gifItem}>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
      </div>
    </div>
  );
};
