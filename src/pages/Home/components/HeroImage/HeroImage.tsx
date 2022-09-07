import img375jpg from '../../../../assets/images/hero/hero-375.jpg';
import img768jpg from '../../../../assets/images/hero/hero-768.jpg';
import img1980jpg from '../../../../assets/images/hero/hero-1980.jpg';
import img375webp from '../../../../assets/images/hero/hero-375.webp';
import img768webp from '../../../../assets/images/hero/hero-768.webp';
import img1980webp from '../../../../assets/images/hero/hero-1980.webp';

import styles from './HeroImage.module.css';

const HeroImage = () => {
  return (
    <picture>
      <source
        type="image/webp"
        media="(max-width: 375px)"
        srcSet={`${img375webp}, ${img768webp} 2x`}
      />
      <source
        type="image/webp"
        media="(max-width: 768px)"
        srcSet={`${img768webp}, ${img1980webp} 2x`}
      />
      <source type="image/webp" media="(min-width: 769px)" srcSet={img1980webp} />
      <source media="(max-width: 375px)" srcSet={`${img375jpg}, ${img768jpg} 2x`} />
      <source media="(max-width: 768px)" srcSet={`${img768jpg}, ${img1980jpg} 2x`} />
      <source media="(min-width: 769px)" srcSet={img1980jpg} />
      <img className={styles.heroImage} src={img1980jpg} />
    </picture>
  );
};

export default HeroImage;
