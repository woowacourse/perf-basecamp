import { UIEventHandler, useState } from 'react';
import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const numItems = 300; // 결국 보여줘야할 총 아이템 수
  const windowHeight = 65 * 5; // 할당된 높이공간
  const itemHeight = 65; // 아이템 높이 결정

  const innerHeight = numItems * itemHeight; // 아이템들의 높이공간
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.min(numItems - 1, Math.floor((scrollTop + windowHeight) / itemHeight)) + 2;
  console.log(start, end);
  console.log(artists.slice(start, end + 1));
  const handleScroll: UIEventHandler = (e) => {
    if (e.currentTarget === null) return;
    setScrollTop((e.currentTarget as HTMLElement).scrollTop);
  };

  return (
    <div onScroll={handleScroll} style={{ overflowY: 'scroll', height: `${windowHeight}px` }}>
      <ul style={{ position: 'relative', height: `${innerHeight}px` }}>
        {artists.slice(start, end + 1).map((artist, index) => (
          <ArtistInfo
            key={Math.random()}
            artist={artist}
            style={{
              position: 'absolute',
              top: `${(start + index) * itemHeight}px`,
              width: '100%'
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default ArtistList;
