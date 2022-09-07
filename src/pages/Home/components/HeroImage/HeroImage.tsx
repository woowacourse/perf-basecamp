import heroImagePng from '../../../../assets/images/hero.png';
import heroImageWebpMobile from '../../../../assets/images/hero-375.webp';
import heroImageWebpTablet from '../../../../assets/images/hero-768.webp';
import heroImageWebpDesktop from '../../../../assets/images/hero-1980.webp';

import styles from './HeroImage.module.css';

const HeroImage = () => {
  return (
    <picture>
      <source type="image/webp" media="(max-width: 375px)" srcSet={heroImageWebpMobile} />
      <source type="image/webp" media="(max-width: 768px)" srcSet={heroImageWebpTablet} />
      <source type="image/webp" media="(min-width: 769px)" srcSet={heroImageWebpDesktop} />
      <img className={styles.heroImage} src={heroImagePng} alt="hero image" />
    </picture>
  );
};

export default HeroImage;
