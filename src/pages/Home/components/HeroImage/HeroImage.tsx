import img1980jpg from '../../../../assets/images/hero-1980.jpg';
import img375webp from '../../../../assets/images/hero-375.webp';
import img768webp from '../../../../assets/images/hero-768.webp';
import img1980webp from '../../../../assets/images/hero-1980.webp';

import styles from './HeroImage.module.css';

const HeroImage = () => {
  return (
    <picture>
      <source type="image/webp" media="(max-width: 375px)" srcSet={img375webp} />
      <source type="image/webp" media="(max-width: 768px)" srcSet={img768webp} />
      <source type="image/webp" media="(min-width: 769px)" srcSet={img1980webp} />
      <img className={styles.heroImage} src={img1980jpg} alt="hero image" />
    </picture>
  );
};

export default HeroImage;
