declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.mp4' {
  const src: string;
  export default src;
}
