import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';
import { memo } from 'react';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <ul>
      {artists.map((artist, index) => {
        return <ArtistInfo key={index} artist={artist} />;
      })}
    </ul>
  );
};

export default ArtistList;
export const MemoizedArtistList = memo(ArtistList, (prevArtists, nextArtists) =>
  nextArtists.artists.every((nextArtist, index) => {
    const prevArtist = prevArtists.artists[index];
    return (
      nextArtist.name === prevArtist.name &&
      nextArtist.profileImageUrl === nextArtist.profileImageUrl &&
      nextArtist.profileUrl === prevArtist.profileUrl
    );
  })
);
