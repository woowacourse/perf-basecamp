import { memo } from 'react';
import { Artist } from '../../../../types/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

interface ArtistListProps {
  artists: Artist[];
}

const ArtistList = ({ artists }: ArtistListProps): JSX.Element => {
  return (
    <ul>
      {artists.map((artist, index) => {
        return <ArtistInfo key={index} artist={artist} />;
      })}
    </ul>
  );
};

export default memo(ArtistList);
