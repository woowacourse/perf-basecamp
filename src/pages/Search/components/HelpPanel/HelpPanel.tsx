import classNames from 'classnames/bind';
import { useState } from 'react';
import { AiOutlineClose, AiOutlineInfo } from 'react-icons/ai';

import ArtistContent from '../ArtistContent/ArtistContent';
import { getArtists } from './artistUtil';

import styles from './HelpPanel.module.css';

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
        <div className={styles.sheetContentsContainer} style={{ overflowY: 'hidden' }}>
          {/* <section> */}
          <ArtistContent artists={artists} />
          {/* </section> */}
        </div>
      </section>
    </>
  );
};

export default HelpPanel;
