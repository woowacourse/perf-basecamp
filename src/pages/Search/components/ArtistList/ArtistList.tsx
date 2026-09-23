import { Artist } from '../../../../models/help/artist';
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

export default ArtistList;
