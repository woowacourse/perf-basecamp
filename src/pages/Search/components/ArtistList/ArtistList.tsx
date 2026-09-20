import { useEffect, useRef, useState } from 'react';

import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
};

const PAGE_SIZE = 20;

const ArtistList = ({ artists }: ArtistListProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const hasMore = visibleCount < artists.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (sentinel === null) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((count) => count + PAGE_SIZE);
      }
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <ul>
      {artists.slice(0, visibleCount).map((artist, index) => {
        return <ArtistInfo key={index} artist={artist} />;
      })}
      {hasMore && <li ref={sentinelRef} />}
    </ul>
  );
};

export default ArtistList;
