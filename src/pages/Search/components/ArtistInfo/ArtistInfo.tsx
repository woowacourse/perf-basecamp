import React from 'react';
import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

export type ArtistProps = {
  artist: Artist;
};

const ArtistInfo = ({ artist, ...props }: ArtistProps & React.HTMLAttributes<HTMLLIElement>) => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li className={styles.artistContainer} {...props}>
      <img className={styles.profileImage} src={profileImageUrl} />
      <p>
        <a className={styles.profileUrl} href={profileUrl}>
          {name}
        </a>
      </p>
    </li>
  );
};

export default React.memo(ArtistInfo);
