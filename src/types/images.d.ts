declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';

declare module '*as=webp';
declare module '*width=1200';
declare module '*width=300';

interface ResponsiveImageMeta {
  src: string;
  srcSet: string;
  placeholder: string | undefined;
  images: { path: string; width: number; height: number }[];
  width: number;
  height: number;
  toString: () => string;
}

declare module '*.responsive.png' {
  const src: ResponsiveImageMeta;
  export default src;
}
