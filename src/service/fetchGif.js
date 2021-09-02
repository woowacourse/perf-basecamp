/**
 * 응답 예제는 아래 링크에서 참고
 * https://developers.giphy.com/explorer/#explorer
 */
const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

const formatResponse = (gifList) => {
  return gifList.map((gif) => {
    return {
      id: gif.id,
      title: gif.title,
      imageUrl: gif.images.original.url,
    };
  });
};

export const fetchTrendingGifs = async () => {
  const cachedItem = JSON.parse(sessionStorage.getItem('trendingGifts'));

  if (cachedItem) {
    return cachedItem;
  }

  const trendingGifts = await fetch(TRENDING_GIF_API)
    .then((response) => response.json())
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });

  sessionStorage.setItem('trendingGifts', JSON.stringify(trendingGifts));

  return trendingGifts;
};

export const fetchGifsByKeyword = async (keyword, page = 0) => {
  const { GiphyFetch } = await import('@giphy/js-fetch-api');

  const offset = page * DEFAULT_FETCH_COUNT;
  const gf = new GiphyFetch(process.env.GIPHY_API_KEY);

  return gf
    .search(keyword, { limit: DEFAULT_FETCH_COUNT, lang: 'en', offset })
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });
};
