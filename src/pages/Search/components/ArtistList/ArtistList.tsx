import { Artist } from '../../../../models/help/artist';
import { MemoizedArtistInfo } from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <ul>
      {artists.map((artist, index) => {
        return <MemoizedArtistInfo key={index} artist={artist} />;
      })}
    </ul>
  );
};

export default ArtistList;
