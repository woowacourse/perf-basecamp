declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';
declare module '*as=webp';
declare module '*as=jpg';

interface ResponsiveImageOutput {
  src: string;
  srcSet: string;
  placeholder: string | undefined;
  images: { path: string; width: number; height: number }[];
  width: number;
  height: number;
  toString: () => string;
}

declare module '*.responsive.*' {
  const src: ResponsiveImageOutput;
  export default src;
}
