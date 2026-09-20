import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

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
