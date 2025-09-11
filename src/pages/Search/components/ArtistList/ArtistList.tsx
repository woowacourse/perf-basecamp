import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
  style: React.CSSProperties;
};

const ArtistList = ({ artists, style }: ArtistListProps) => {
  return (
    <ul>
      {artists.map((artist, index) => {
        return <ArtistInfo key={index} artist={artist} style={style} />;
      })}
    </ul>
  );
};

export default ArtistList;
