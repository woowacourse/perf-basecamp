export interface GifImageModel {
  id: string | number;
  title: string;
  sources: {
    mp4?: string;
    webp?: string;
    gif?: string;
  };
}
