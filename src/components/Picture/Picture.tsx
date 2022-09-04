import styles from './Picture.module.css';

const sourceWidths = [640, 768, 960, 1024, 1366, 1920] as const;

interface Props {
  imageName: string;
}

function Picture({ imageName }: Props) {
  return (
    <picture>
      {sourceWidths.map((width) => (
        <source
          media={`(max-width: ${width - 1}px)`}
          srcSet={`/public/assets/images/${imageName}-${width}.webp`}
          type="image/webp"
        />
      ))}

      {sourceWidths.map((width) => (
        <source
          media={`(max-width: ${width - 1}px)`}
          srcSet={`/public/assets/images/${imageName}-${width}.jpg`}
          type="image/jpg"
        />
      ))}

      <img
        className={styles.heroImage}
        src={`/public/assets/images/${imageName}-${Math.max(...sourceWidths)}.jpg`}
        alt="hero image"
      />
    </picture>
  );
}

export default Picture;
