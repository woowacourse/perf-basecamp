import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';
import { FixedSizeList as List } from 'react-window';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <List
      height={400} // 리스트의 총 높이 (보이는 영역)
      itemCount={artists.length} // 전체 아이템 개수
      itemSize={50} // 각 아이템의 고정 높이
      width={'100%'} // 리스트의 너비
    >
      {({ index, style }) => (
        <div style={style}>
          <ArtistInfo artist={artists[index]} />
        </div>
      )}
    </List>
  );
};

export default ArtistList;
