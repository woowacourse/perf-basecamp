import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';
import { FixedSizeList as List } from 'react-window';
type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <List
      height={480} // 표시할 리스트의 전체 높이
      itemCount={artists.length} // 리스트 아이템 수
      itemSize={60} // 각 아이템의 고정 높이
      width="100%" // 리스트 너비
    >
      {({ index, style }) => (
        <div style={style}>
          <ArtistInfo key={index} artist={artists[index]} />
        </div>
      )}
    </List>
  );
};

export default ArtistList;
