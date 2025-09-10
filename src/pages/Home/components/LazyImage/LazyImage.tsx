import { useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  placeholder?: string;
  style?: React.CSSProperties;
}

const LazyImage = ({
  src,
  alt,
  loading = 'lazy',
  decoding = 'async',
  className = '',
  ...props
}: LazyImageProps) => {
  const { targetRef, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div ref={targetRef} className={className} {...props}>
      {hasIntersected && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
