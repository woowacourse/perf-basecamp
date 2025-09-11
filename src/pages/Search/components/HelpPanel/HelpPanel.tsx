import { useState } from 'react';
import { AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames/bind';

import { getArtists } from './artistUtil';

import styles from './HelpPanel.module.css';
import VirtualizedList from '../VirtualizedList/VirtualizedList';
import ArtistInfo from '../ArtistInfo/ArtistInfo';

const cx = classNames.bind(styles);

const HelpPanel = () => {
  const artists = getArtists();
  const [isShow, setIsShow] = useState(false);
  const openSheet = () => setIsShow(true);
  const closeSheet = () => setIsShow(false);

  return (
    <>
      <button type="button" className={styles.floatingButton} onClick={openSheet}>
        <AiOutlineInfo color="white" size="24px" />
      </button>
      <section
        className={cx('selectedItemContainer', {
          showSheet: isShow
        })}
      >
        <div className={styles.sheetTitleContainer}>
          <h4>What's all this? </h4>
          <button type="button" onClick={closeSheet}>
            <AiOutlineClose size="24px" />
          </button>
        </div>
        <div className={styles.sheetContentsContainer}>
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
            <a href="https://support.giphy.com/hc/en-us/articles/360019977552-How-to-Upload">
              here
            </a>
            &nbsp;and upload your work!
          </p>
          <br />
          <p>Here are some artists you can refer to.</p>
          <br />
          <section>
            <VirtualizedList
              numItems={artists.length}
              // height 60 + margin-bottom 16 = 76
              itemHeight={76}
              renderItem={({ index, style }) => {
                return (
                  <ArtistInfo
                    key={index}
                    artist={artists[index]}
                    style={style as React.CSSProperties}
                  />
                );
              }}
              windowHeight={300}
            />
          </section>
        </div>
      </section>
    </>
  );
};

export default HelpPanel;
