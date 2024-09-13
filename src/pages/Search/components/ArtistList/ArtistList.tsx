import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';
import { FixedSizeList as List } from 'react-window';

type ArtistListProps = {
  artists: Artist[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  return (
    <div style={{ height: `calc(100vh - 620px)`, overflow: 'visible' }}>
      <AutoSizer>
        {({ height, width }: Size) => (
          <List
            height={height}
            itemCount={artists.length}
            itemSize={76}
            itemData={artists}
            width={width}
          >
            {({ index, style, data }) => (
              <div style={style}>
                <ArtistInfo key={index} artist={data[index]} />
              </div>
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default ArtistList;
