import { memo } from 'react';
import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

export type ArtistProps = {
  artist: Artist;
};

const ArtistInfo = ({ artist }: ArtistProps) => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li className={styles.artistContainer}>
      <img className={styles.profileImage} src={profileImageUrl} />
      <p>
        <a className={styles.profileUrl} href={profileUrl}>
          {name}
        </a>
      </p>
    </li>
  );
};

const MemoArtistInfo = memo(ArtistInfo);

export default MemoArtistInfo;
