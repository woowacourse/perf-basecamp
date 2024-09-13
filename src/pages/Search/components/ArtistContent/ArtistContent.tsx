import { Artist } from '../../../../models/help/artist';
import ArtistInfo from '../ArtistInfo/ArtistInfo';
import useListVirtualization from '../../hooks/useListVirtualization';

type ArtistContentProps = {
  artists: Artist[];
};

const ArtistContent = ({ artists }: ArtistContentProps) => {
  const itemHeight = 65;
  const { handleScroll, startIndex, endIndex, windowHeight, innerStartHeight, innerHeight } =
    useListVirtualization({
      upperHeight: 555,
      numItems: 10000,
      numOfItemsInFirst: 8,
      itemHeight
    });

  return (
    <div onScroll={handleScroll} style={{ overflowY: 'scroll', height: `${windowHeight}px` }}>
      <section>
        <img src="https://media0.giphy.com/media/3oKIPdiPGxPI7Dze7u/giphy.gif?cid=ecf05e475f5bct6ci09g3pgn43nf6bausx33fj7f96f6ig92&rid=giphy.gif&ct=g" />
        <p>
          'memegle' is powered by GIPHY, the top source for the best & newest GIFs & Animated
          Stickers online. You can find any gif uploaded on GIPHY here.
        </p>
        <br />

        <img src="https://giphy.com/static/img/artistdirectory_1040.gif" />
        <p>
          If you want more, you are always welcome to contribute as an artist. Please refer to the
          guideline&nbsp;
          <a href="https://support.giphy.com/hc/en-us/articles/360019977552-How-to-Upload">here</a>
          &nbsp;and upload your work!
        </p>
        <br />
        <p>Here are some artists you can refer to.</p>
        <br />
      </section>
      <section style={{ position: 'relative', height: `${innerHeight}px` }}>
        <ul
          style={{
            position: 'absolute',
            top: `${innerStartHeight}px`
          }}
        >
          {artists.slice(startIndex, endIndex + 1).map((artist) => (
            <ArtistInfo
              key={artist.name}
              artist={artist}
              style={{
                width: '100%',
                height: `${itemHeight}px`,
                margin: '0px'
              }}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ArtistContent;
