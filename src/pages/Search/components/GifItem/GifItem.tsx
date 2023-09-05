import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', videoUrl = '', title = '', url = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <a href={url}>
        <video
          className={styles.gifImage}
          src={videoUrl}
          poster={imageUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      </a>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default GifItem;
