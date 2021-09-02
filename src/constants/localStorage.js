export const LOCALSTORAGE_KEY = Object.freeze({
  TRENDING_GIFS: "trending_gifs",
  KEYWORD_GIFS: (keyword, page) => `keyword_${keyword}_${page}_gifs`,
});
