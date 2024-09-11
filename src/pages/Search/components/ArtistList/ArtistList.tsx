import { useEffect, useRef, useState } from 'react';
import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
};

const initialOption = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};

const ArtistList = ({ artists }: ArtistListProps) => {
  const [renderIndex, setRenderIndex] = useState(20);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRenderIndex((prev) => prev + 1);
        }
      });
    }, initialOption);

    const target = observerRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ul>
        {artists.slice(0, renderIndex).map((artist, index) => {
          return <ArtistInfo key={index} artist={artist} />;
        })}
      </ul>
      {renderIndex < artists.length && (
        <div ref={observerRef} style={{ height: '100px', margin: '0', padding: '0' }} />
      )}
    </>
  );
};

export default ArtistList;
