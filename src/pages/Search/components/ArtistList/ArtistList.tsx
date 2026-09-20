import { RefObject, useEffect, useRef, useState } from 'react';
import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

const ARTIST_ROW_HEIGHT = 60;
const ARTIST_ROW_GAP = 16;
const ARTIST_ROW_STRIDE = ARTIST_ROW_HEIGHT + ARTIST_ROW_GAP;
const OVERSCAN_ROWS = 4;
const VIRTUALIZATION_THRESHOLD = 1000;
const INITIAL_VISIBLE_ROWS = 12;

type ArtistListProps = {
  artists: Artist[];
  scrollContainerRef: RefObject<HTMLDivElement>;
};

const getListHeight = (artistCount: number) =>
  Math.max(0, artistCount * ARTIST_ROW_STRIDE - ARTIST_ROW_GAP);

const ArtistList = ({ artists, scrollContainerRef }: ArtistListProps) => {
  const shouldVirtualize = artists.length > VIRTUALIZATION_THRESHOLD;
  const listRef = useRef<HTMLUListElement>(null);
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: Math.min(artists.length, INITIAL_VISIBLE_ROWS)
  });
  useEffect(() => {
    if (!shouldVirtualize) return;

    const scrollContainer = scrollContainerRef.current;
    const list = listRef.current;
    if (scrollContainer === null || list === null) return;

    let frameId: number | null = null;

    const updateVisibleRange = () => {
      frameId = null;
      const listTop =
        list.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop;
      const visibleTop = Math.max(0, scrollContainer.scrollTop - listTop);
      const start = Math.min(
        artists.length,
        Math.max(0, Math.floor(visibleTop / ARTIST_ROW_STRIDE) - OVERSCAN_ROWS)
      );
      const end = Math.min(
        artists.length,
        Math.max(
          start,
          Math.ceil((visibleTop + scrollContainer.clientHeight) / ARTIST_ROW_STRIDE) + OVERSCAN_ROWS
        )
      );

      setVisibleRange((current) =>
        current.start === start && current.end === end ? current : { start, end }
      );
    };

    const scheduleUpdate = () => {
      if (frameId === null) frameId = requestAnimationFrame(updateVisibleRange);
    };

    scheduleUpdate();
    scrollContainer.addEventListener('scroll', scheduleUpdate, { passive: true });
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener('scroll', scheduleUpdate);
      resizeObserver.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [artists.length, scrollContainerRef, shouldVirtualize]);

  if (!shouldVirtualize) {
    return (
      <ul>
        {artists.map((artist, index) => (
          <ArtistInfo key={index} artist={artist} />
        ))}
      </ul>
    );
  }

  return (
    <ul ref={listRef} style={{ height: getListHeight(artists.length) }}>
      {artists.slice(visibleRange.start, visibleRange.end).map((artist, offset) => {
        const index = visibleRange.start + offset;
        return (
          <ArtistInfo
            key={index}
            artist={artist}
            placement={{
              top: index * ARTIST_ROW_STRIDE,
              position: index + 1,
              total: artists.length
            }}
          />
        );
      })}
    </ul>
  );
};

export default ArtistList;
