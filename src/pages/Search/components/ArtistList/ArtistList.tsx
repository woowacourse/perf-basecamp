import { FixedSizeList as List } from 'react-window';
import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';
import React from 'react';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  const itemSize = 60; // 각 ArtistInfo 컴포넌트의 고정 높이

  return (
    <List
      height={600} // 리스트의 전체 높이 (보이는 영역)
      itemCount={artists.length} // 아이템 개수
      itemSize={itemSize} // 각 아이템의 높이
      width="100%" // 리스트의 가로 너비
    >
      {({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>
          <ArtistInfo artist={artists[index]} />
        </div>
      )}
    </List>
  );
};

export default ArtistList;
