import { Artist } from '../models/help/artist';

const DUMMY_ARTISTS_LENGTH = 500;
const dummyArtists: Artist[] = [
  {
    name: 'Pola Lucas',
    profileUrl: 'https://giphy.com/polalucas',
    profileImageUrl:
      'https://media2.giphy.com/media/gwWAA4PYJLTtyOHkUD/200w.gif?cid=7250d880sshc3yas6ko9mpvmps27jqqxpa81zdofbk8e1hyg&ep=v1_gifs_gifId&rid=200w.gif&ct=g'
  },
  {
    name: 'Yizr',
    profileUrl: 'https://giphy.com/yizr',
    profileImageUrl:
      'https://media4.giphy.com/media/ERSJTRt7CmKkhLswtl/200w.gif?cid=7250d88035cqh8mld46sh3hekve03g885hj90z9f321cdoh1&ep=v1_gifs_gifId&rid=200w.gif&ct=g'
  },
  {
    name: 'YUNGSUNG',
    profileUrl: 'https://giphy.com/yungsung',
    profileImageUrl:
      'https://media0.giphy.com/media/lgnOH6bhb1QpUm2k6w/200w.gif?cid=7250d880zjz4l99976e87lrc7phvr8r1m2l6cpl08c4g88d1&ep=v1_gifs_gifId&rid=200w.gif&ct=g'
  },
  {
    name: 'Kev Lavery',
    profileUrl: 'https://giphy.com/kevlavery',
    profileImageUrl:
      'https://media2.giphy.com/media/ZPLluhRJiGwSttn7i2/200w.gif?cid=7250d8800g2vjej9cu0hrhdjewkkgoo9croqajcnqmkxikqe&ep=v1_gifs_gifId&rid=200w.gif&ct=g'
  },
  {
    name: 'Lorna Mills',
    profileUrl: 'https://giphy.com/lornamills',
    profileImageUrl:
      'https://media1.giphy.com/media/l0Iyn1gGtCPa3x41a/200w.gif?cid=7250d8809n56lkd54m7wuoiibuimtslpvlke4mf6ij1extz7&ep=v1_gifs_gifId&rid=200w.gif&ct=g'
  }
];

export const artists = Array.from({ length: DUMMY_ARTISTS_LENGTH }, (_v, k) =>
  Artist(dummyArtists[k % dummyArtists.length])
);
