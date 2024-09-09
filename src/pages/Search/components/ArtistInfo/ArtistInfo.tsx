import { memo } from 'react';
import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

export type ArtistProps = {
  artist: Artist;
  style: any;
};

const ArtistInfo = ({ artist, style }: ArtistProps) => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li className={styles.artistContainer} style={style}>
      <img className={styles.profileImage} src={profileImageUrl} />
      <p>
        <a className={styles.profileUrl} href={profileUrl}>
          {name}
        </a>
      </p>
    </li>
  );
};

export default ArtistInfo;

export const MemoizedArtistInfo = memo(ArtistInfo);
