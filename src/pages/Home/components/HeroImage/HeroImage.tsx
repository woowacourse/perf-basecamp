import hero_375_png from '../../../../assets/images/hero-375.png';
import hero_768_png from '../../../../assets/images/hero-768.png';
import hero_1980_png from '../../../../assets/images/hero-1980.png';
import hero_375_webp from '../../../../assets/images/hero-375.webp';
import hero_768_webp from '../../../../assets/images/hero-768.webp';
import hero_1980_webp from '../../../../assets/images/hero-1980.webp';

import styles from './HeroImage.module.css';

const HeroImage = () => {
  return (
    <picture>
      <source
        type="image/webp"
        media="(max-width: 375px)"
        srcSet={`${hero_375_webp}, ${hero_768_webp} 2x`}
      />
      <source
        type="image/webp"
        media="(max-width: 768px)"
        srcSet={`${hero_768_webp}, ${hero_1980_webp} 2x`}
      />
      <source type="image/webp" media="(min-width: 769px)" srcSet={hero_1980_webp} />
      <source media="(max-width: 375px)" srcSet={`${hero_375_png}, ${hero_768_png} 2x`} />
      <source media="(max-width: 768px)" srcSet={`${hero_768_png}, ${hero_1980_png} 2x`} />
      <source media="(min-width: 769px)" srcSet={hero_1980_png} />
      <img className={styles.heroImage} src={hero_1980_png} />
    </picture>
  );
};

export default HeroImage;
