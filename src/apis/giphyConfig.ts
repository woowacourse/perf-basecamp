export const API_KEY = process.env.GIPHY_API_KEY ?? '';
export const BASE_URL = 'https://api.giphy.com/v1/gifs';
export const DEFAULT_FETCH_COUNT = 16;

declare global {
  interface Window {
    memegleTrendingRequest?: {
      url: string;
      response: Promise<Response>;
    };
  }
}

// Keep the early HTML request and application request in sync.
export const TRENDING_URL =
  API_KEY === ''
    ? ''
    : `${BASE_URL}/trending?${new URLSearchParams({
        api_key: API_KEY,
        limit: String(DEFAULT_FETCH_COUNT),
        rating: 'g'
      }).toString()}`;
