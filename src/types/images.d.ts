interface ResponsiveImageData {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

declare module '*.png';
declare module '*.png?webp' {
  const image: ResponsiveImageData;
  export default image;
}
declare module '*.jpg';
declare module '*.jpg?webp' {
  const image: ResponsiveImageData;
  export default image;
}
declare module '*.gif';
declare module '*.svg';
declare module '*.mp4';

declare module '*.webp' {
  const src: string;
  export default src;
}
