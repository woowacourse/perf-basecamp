import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

export type ArtistProps = {
  artist: Artist;
};

const ArtistInfo = ({ artist }: ArtistProps) => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li className={styles.artistContainer}>
      <img className={styles.profileImage} src={profileImageUrl} alt={name} />
      <p>
        <a className={styles.profileUrl} href={profileUrl}>
          {name}
        </a>
      </p>
    </li>
  );
};

export default ArtistInfo;
