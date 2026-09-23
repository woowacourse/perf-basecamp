import heroAvif640 from '../../../../assets/images/hero.png?as=avif&w=640&sharp';
import heroAvif1280 from '../../../../assets/images/hero.png?as=avif&w=1280&sharp';
import heroAvif1440 from '../../../../assets/images/hero.png?as=avif&w=1440&sharp';
import heroAvif1920 from '../../../../assets/images/hero.png?as=avif&w=1920&sharp';
import heroWebp640 from '../../../../assets/images/hero.png?as=webp&w=640&sharp';
import heroWebp1280 from '../../../../assets/images/hero.png?as=webp&w=1280&sharp';
import heroWebp1440 from '../../../../assets/images/hero.png?as=webp&w=1440&sharp';
import heroWebp1920 from '../../../../assets/images/hero.png?as=webp&w=1920&sharp';

import styles from './HeroImage.module.css';

const HeroImage = (): JSX.Element => (
  <picture className={styles.picture}>
    <source
      type="image/avif"
      srcSet={`${heroAvif640} 640w, ${heroAvif1280} 1280w, ${heroAvif1440} 1440w, ${heroAvif1920} 1920w`}
      sizes="100vw"
    />
    <img
      className={styles.image}
      src={heroWebp1920}
      srcSet={`${heroWebp640} 640w, ${heroWebp1280} 1280w, ${heroWebp1440} 1440w, ${heroWebp1920} 1920w`}
      sizes="100vw"
      width="1920"
      height="1281"
      fetchPriority="high"
      alt=""
    />
  </picture>
);

export default HeroImage;
