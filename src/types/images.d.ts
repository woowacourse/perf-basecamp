interface GeneratedImageData {
  src: string;
  width: number;
  height: number;
}

declare module '*.png';
declare module '*.png?webp' {
  const image: GeneratedImageData;
  export default image;
}
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';
declare module '*.mp4';
