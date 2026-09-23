export interface GifImageModel {
  id: string | number;
  title: string;
  sources: {
    video?: string;
    poster?: string;
    webp?: string;
    gif?: string;
  };
}
