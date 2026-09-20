import { Artist } from '../../../../models/help/artist';

import styles from './ArtistInfo.module.css';

type ArtistPlacement = {
  top: number;
  position: number;
  total: number;
};

export type ArtistProps = {
  artist: Artist;
  placement?: ArtistPlacement;
};

const ArtistInfo = ({ artist, placement }: ArtistProps) => {
  const { name, profileUrl, profileImageUrl } = artist;

  return (
    <li
      className={
        placement ? `${styles.artistContainer} ${styles.virtualized}` : styles.artistContainer
      }
      style={placement ? { top: placement.top } : undefined}
      aria-posinset={placement?.position}
      aria-setsize={placement?.total}
    >
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
