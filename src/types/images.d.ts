declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';

declare module '*.png?as=webp' {
  const value: string;
  export default value;
}
declare module '*.png?as=webp&w=1980' {
  const value: string;
  export default value;
}

declare module '*.jpg?as=webp' {
  const value: string;
  export default value;
}

declare module '*.gif?as=webp' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}
