declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.mp4';
declare module '*.svg';
declare module '*.webp';
declare module '*.png?as=webp-png' {
  const src: string;
  export default src;
}
declare module '*.png?as=avif-png' {
  const src: string;
  export default src;
}
declare module '*.gif?as=webp-gif' {
  const src: string;
  export default src;
}
