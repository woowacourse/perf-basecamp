import { memo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

import heroImage from '../../assets/images/hero.webp';

// 중요하지 않은 컴포넌트들은 지연 로딩
const LazyCustomCursor = lazy(() => import('./components/CustomCursor/CustomCursor'));

import styles from './Home.module.css';

const FeatureSectionPlaceholder = () => (
  <div className={styles.featurePlaceholder}>Loading features...</div>
);

const Home = memo(() => {
  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={`${heroImage} 1x`}
            sizes="100vw"
            type="image/webp"
          />
          <source
            media="(max-width: 1200px)"
            srcSet={`${heroImage} 1x`}
            sizes="50vw"
            type="image/webp"
          />
          <img
            className={styles.heroImage}
            src={heroImage}
            alt="hero image"
            fetchPriority="high"
            decoding="sync"
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            width="800"
            height="450"
          />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search">
          <button className={`${styles.cta} ${styles.linkButton}`}>start search</button>
        </Link>
      </section>

      <FeatureSectionPlaceholder />
      <Suspense fallback={null}>
        <LazyCustomCursor text="memegle" />
      </Suspense>
    </>
  );
});

Home.displayName = 'Home';

export default Home;
