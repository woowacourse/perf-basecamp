import { Artist } from '../../../../types/artist';

import styles from './ArtistInfo.module.css';

export interface ArtistProps {
  artist: Artist;
}

const ArtistInfo = ({ artist }: ArtistProps): JSX.Element => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li className={styles.artistContainer}>
      <img
        className={styles.profileImage}
        src={profileImageUrl}
        alt={name}
        width="60"
        height="60"
        loading="lazy"
        decoding="async"
      />
      <p>
        <a className={styles.profileUrl} href={profileUrl}>
          {name}
        </a>
      </p>
    </li>
  );
};

export default ArtistInfo;
