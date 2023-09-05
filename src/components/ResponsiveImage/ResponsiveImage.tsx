import classNames from 'classnames';
import styles from './ResponsiveImage.module.css';

type ResponsiveImageProps = React.HTMLAttributes<HTMLDivElement> & {
  image: ResponsiveImageMeta;
  alt?: string;
  fetchPriority?: 'low' | 'high' | 'auto';
};

const ResponsiveImage = ({ image, alt, fetchPriority, ...divProps }: ResponsiveImageProps) => {
  return (
    <div
      {...{ ...divProps, ...(fetchPriority ? { fetchpriority: fetchPriority } : {}) }}
      className={classNames(styles.imageFrame, divProps.className)}
    >
      {image.placeholder && <img className={styles.image} src={image.placeholder} />}
      <img className={styles.image} src={image.src} srcSet={image.srcSet} alt={alt} />
    </div>
  );
};

export default ResponsiveImage;
