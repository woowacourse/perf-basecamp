import { UIEvent, useState } from 'react';

import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

import styles from './ArtistList.module.css';

interface ArtistListProps {
  artists: Artist[];
}

const LIST_HEIGHT = 400;
const ITEM_HEIGHT = 76;
const OVERSCAN_COUNT = 3;
const VISIBLE_ITEM_COUNT = Math.ceil(LIST_HEIGHT / ITEM_HEIGHT) + OVERSCAN_COUNT * 2;

const ArtistList = ({ artists }: ArtistListProps): JSX.Element => {
  const [startIndex, setStartIndex] = useState(0);
  const endIndex = Math.min(startIndex + VISIBLE_ITEM_COUNT, artists.length);
  const visibleArtists = artists.slice(startIndex, endIndex);

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    const nextStartIndex = Math.max(
      Math.floor(event.currentTarget.scrollTop / ITEM_HEIGHT) - OVERSCAN_COUNT,
      0
    );

    setStartIndex(nextStartIndex);
  };

  return (
    <div className={styles.artistListViewport} onScroll={handleScroll}>
      <ul className={styles.artistList} style={{ height: artists.length * ITEM_HEIGHT }}>
        {visibleArtists.map((artist, index) => {
          const artistIndex = startIndex + index;

          return (
            <ArtistInfo key={artistIndex} artist={artist} offsetY={artistIndex * ITEM_HEIGHT} />
          );
        })}
      </ul>
    </div>
  );
};

export default ArtistList;
