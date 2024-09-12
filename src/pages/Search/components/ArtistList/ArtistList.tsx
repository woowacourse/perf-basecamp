import { FixedSizeList as List } from 'react-window';
import { Artist } from '../../../../models/help/artist';
import { MemoizedArtistInfo } from '../ArtistInfo/ArtistInfo';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <List height={600} itemCount={artists.length} itemSize={60} width="100%">
      {({ index, style }) => (
        <div style={style}>
          <MemoizedArtistInfo artist={artists[index]} />
        </div>
      )}
    </List>
  );
};

export default ArtistList;
