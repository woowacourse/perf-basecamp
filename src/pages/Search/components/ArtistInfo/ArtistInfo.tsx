import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

export interface ArtistProps {
  artist: Artist;
  offsetY: number;
}

const ArtistInfo = ({ artist, offsetY }: ArtistProps): JSX.Element => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li className={styles.artistContainer} style={{ transform: `translateY(${offsetY}px)` }}>
      <img className={styles.profileImage} src={profileImageUrl} loading="lazy" decoding="async" />
      <p>
        <a className={styles.profileUrl} href={profileUrl}>
          {name}
        </a>
      </p>
    </li>
  );
};

export default ArtistInfo;
