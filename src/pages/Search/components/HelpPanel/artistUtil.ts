import { Artist } from '../../../../models/help/artist';

const DUMMY_ARTISTS_LENGTH = 10000;
const DUMMY_ARTISTS: Artist[] = [
  {
    name: 'Pola Lucas',
    profileUrl: 'https://giphy.com/polalucas',
    profileImageUrl: 'https://media4.giphy.com/media/gwWAA4PYJLTtyOHkUD/giphy.gif'
  },
  {
    name: 'Yizr',
    profileUrl: 'https://giphy.com/yizr',
    profileImageUrl:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjE3YWc2Ym02aWxrMDVweDRkNHRiZjdtejhxZTNuNGxlYWZqOWx4YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UJnRqJWD0KrbW/giphy.webp'
  },
  {
    name: 'YUNGSUNG',
    profileUrl: 'https://giphy.com/yungsung',
    profileImageUrl: 'https://media0.giphy.com/media/lgnOH6bhb1QpUm2k6w/giphy.gif'
  },
  {
    name: 'Kev Lavery',
    profileUrl: 'https://giphy.com/kevlavery',
    profileImageUrl: 'https://media1.giphy.com/media/ZPLluhRJiGwSttn7i2/giphy.gif'
  },
  {
    name: 'Lorna Mills',
    profileUrl: 'https://giphy.com/lornamills',
    profileImageUrl: 'https://media1.giphy.com/media/l0Iyn1gGtCPa3x41a/200.gif'
  }
];

const artists = Array.from(
  { length: DUMMY_ARTISTS_LENGTH },
  (_v, k) => DUMMY_ARTISTS[k % DUMMY_ARTISTS.length]
);

export const getArtists = () => artists;
