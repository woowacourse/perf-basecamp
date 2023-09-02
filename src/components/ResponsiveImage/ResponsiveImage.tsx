import styles from './ResponsiveImage.module.css';

type ResponsiveImageProps = React.HTMLAttributes<HTMLDivElement> & {
  image: ResponsiveImageMeta;
  alt?: string;
};

const ResponsiveImage = ({ image, alt, ...divProps }: ResponsiveImageProps) => {
  const style = {
    backgroundSize: 'cover',
    ...divProps.style,
    ...(image.placeholder ? { backgroundImage: `url("${image.placeholder}")` } : {})
  };

  return (
    <div {...divProps} style={style}>
      <img className={styles.image} src={image.src} srcSet={image.srcSet} alt={alt} />
    </div>
  );
};

export default ResponsiveImage;
