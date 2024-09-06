import heroImage_webp_640 from '../../../../assets/images/hero_640.webp';
import heroImage_webp_1280 from '../../../../assets/images/hero_1280.webp';
import heroImage_webp_1920 from '../../../../assets/images/hero_1920.webp';
import heroImage_png_640 from '../../../../assets/images/hero_640.png';
import heroImage_png_1280 from '../../../../assets/images/hero_1280.png';
import heroImage_png_1920 from '../../../../assets/images/hero_1920.png';

import styles from './HeroImage.module.css';

const HeroImage = () => {
  return (
    <picture>
      <source
        className={styles.heroImage}
        srcSet={`
  ${heroImage_webp_640} 640w,
  ${heroImage_webp_1280} 1280w,
  ${heroImage_webp_1920} 1920w
  `}
        sizes="
  (max-width: 640px) 640px, 
  (max-width: 1280px) 1280px, 
  1920px"
      />
      <source
        className={styles.heroImage}
        srcSet={`
  ${heroImage_png_640} 640w,
  ${heroImage_png_1280} 1280w,
  ${heroImage_png_1920} 1920w
  `}
        sizes="
  (max-width: 640px) 640px, 
  (max-width: 1280px) 1280px, 
  1920px"
      />
      <img className={styles.heroImage} src={heroImage_png_1920} alt="Hero section image" />
    </picture>
  );
};

export default HeroImage;
