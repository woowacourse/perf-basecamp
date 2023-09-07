import { Artist } from '../models/help/artist';

const DUMMY_ARTISTS_LENGTH = 500;
const dummyArtists: Artist[] = [
  {
    name: 'Pola Lucas',
    profileUrl: 'https://giphy.com/polalucas',
    profileImageUrl: 'https://media4.giphy.com/media/gwWAA4PYJLTtyOHkUD/giphy.webp'
  },
  {
    name: 'Yizr',
    profileUrl: 'https://giphy.com/yizr',
    profileImageUrl: 'https://media.giphy.com/avatars/yizr/llqaOJQnpDWZ/200h.webp'
  },
  {
    name: 'YUNGSUNG',
    profileUrl: 'https://giphy.com/yungsung',
    profileImageUrl: 'https://media0.giphy.com/media/lgnOH6bhb1QpUm2k6w/giphy.webp'
  },
  {
    name: 'Kev Lavery',
    profileUrl: 'https://giphy.com/kevlavery',
    profileImageUrl: 'https://media1.giphy.com/media/ZPLluhRJiGwSttn7i2/giphy.webp'
  },
  {
    name: 'Lorna Mills',
    profileUrl: 'https://giphy.com/lornamills',
    profileImageUrl: 'https://media1.giphy.com/media/l0Iyn1gGtCPa3x41a/200.webp'
  }
];

export const artists = Array.from({ length: DUMMY_ARTISTS_LENGTH }, (_v, k) =>
  Artist(dummyArtists[k % dummyArtists.length])
);
