import type { Artist } from '../../../../models/help/artist';
import MemoArtistInfo from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <ul>
      {artists.map((artist, index) => {
        return <MemoArtistInfo key={index} artist={artist} />;
      })}
    </ul>
  );
};

export default ArtistList;
