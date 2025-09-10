import { useState } from 'react';
import { AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames/bind';

import ArtistList from '../ArtistList/ArtistList';
import styles from './HelpPanel.module.css';
import { Artist } from '../../../../models/help/artist';

const cx = classNames.bind(styles);

const HelpPanel = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isShow, setIsShow] = useState(false);

  const openSheet = () => {
    if (!isShow && artists.length === 0) {
      import('./artistUtil').then(({ getArtists }) => {
        const fetchedArtists = getArtists();
        setArtists(fetchedArtists);
      });
    }
    setIsShow(true);
  };
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
          {isShow && (
            <>
              <img
                src="https://media0.giphy.com/media/3oKIPdiPGxPI7Dze7u/giphy.gif"
                width={200}
                height={200}
                loading="lazy"
                alt=""
              />
              <p>'memegle' is powered by GIPHY, ...</p>
              <br />
              <img
                src="https://giphy.com/static/img/artistdirectory_1040.gif"
                width={200}
                height={200}
                loading="lazy"
                alt=""
              />
              <p>If you want more, ...</p>
              <br />
              <p>Here are some artists you can refer to.</p>
              <br />
              <section>
                <ArtistList artists={artists} />
              </section>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HelpPanel;
