import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

export type ArtistProps = {
  artist: Artist;
  style: any;
};

const ArtistInfo = ({ artist, style }: ArtistProps) => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li id={artist.name} className={styles.artistContainer} style={style}>
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
