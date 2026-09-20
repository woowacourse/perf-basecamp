export interface GifImageModel {
  id: string | number;
  title: string;
  sources: {
    mp4?: string;
    poster?: string;
    webp?: string;
    gif?: string;
  };
}
