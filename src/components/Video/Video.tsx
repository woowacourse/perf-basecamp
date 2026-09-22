import { VideoHTMLAttributes } from 'react';

import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'children'> {
  src: string;
  loading?: 'lazy' | 'eager';
  rootMargin?: string;
  children?: never;
}

const Video = ({
  src,
  poster,
  loading = 'eager',
  rootMargin = '0px',
  preload = 'auto',
  ...props
}: VideoProps): JSX.Element => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLVideoElement>(rootMargin);
  const shouldLoad = loading === 'eager' || isIntersecting;

  return (
    <video
      {...props}
      ref={ref}
      src={shouldLoad ? src : undefined}
      poster={shouldLoad ? poster : undefined}
      preload={shouldLoad ? preload : 'none'}
    />
  );
};

export default Video;
