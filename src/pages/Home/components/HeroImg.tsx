import styles from '../Home.module.css';

import heroImageWebp from '../../../assets/images/hero.webp';
import heroImageJpg from '../../../assets/images/hero.jpg';

const HeroImg = () => {
  return (
    <picture>
      <source className={styles.heroImage} type="image/webp" srcSet={heroImageWebp} />
      <img className={styles.heroImage} src={heroImageJpg} alt="hero image" />
    </picture>
  );
};

export default HeroImg;
