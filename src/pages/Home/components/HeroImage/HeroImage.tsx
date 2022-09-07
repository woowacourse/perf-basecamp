import heroImageDesktop from '../../../../assets/images/hero_desktop.webp';
import heroImageTablet from '../../../../assets/images/hero_tablet.webp';
import heroImageMobile from '../../../../assets/images/hero_mobile.webp';
import heroImagePng from '../../../../assets/images/hero.png';

import styles from './HeroImage.module.css';

const HeroImage = () => {
  return (
    <picture>
      <source type="image/webp" media="(min-width: 1280px)" srcSet={heroImageDesktop} />
      <source type="image/webp" media="(min-width: 480px)" srcSet={heroImageTablet} />
      <source type="image/webp" media="(max-width: 479px)" srcSet={heroImageMobile} />
      <img className={styles.heroImage} src={heroImagePng} alt="hero-image"></img>
    </picture>
  );
};

export default HeroImage;
