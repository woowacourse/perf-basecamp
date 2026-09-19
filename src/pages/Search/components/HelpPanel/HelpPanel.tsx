import { useEffect, useRef, useState } from 'react';
import { AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames/bind';

import ArtistList from '../ArtistList/ArtistList';
import { getArtists } from './artistUtil';

import styles from './HelpPanel.module.css';

const cx = classNames.bind(styles);

const HelpPanel = () => {
  const artists = getArtists();
  const [isShow, setIsShow] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openSheet = () => {
    setHasOpened(true);
    setIsShow(true);
  };
  const closeSheet = () => {
    openButtonRef.current?.focus();
    setIsShow(false);
  };

  useEffect(() => {
    if (panelRef.current !== null) panelRef.current.inert = !isShow;
    if (isShow) closeButtonRef.current?.focus();
  }, [isShow]);

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        className={styles.floatingButton}
        aria-label="Open help"
        aria-expanded={isShow}
        aria-controls="help-panel"
        onClick={openSheet}
      >
        <AiOutlineInfo color="white" size="24px" />
      </button>
      <section
        ref={panelRef}
        id="help-panel"
        aria-hidden={!isShow}
        className={cx('selectedItemContainer', {
          showSheet: isShow
        })}
      >
        <div className={styles.sheetTitleContainer}>
          <h4>What's all this? </h4>
          <button ref={closeButtonRef} type="button" aria-label="Close help" onClick={closeSheet}>
            <AiOutlineClose size="24px" />
          </button>
        </div>
        {hasOpened && (
          <div className={styles.sheetContentsContainer}>
            <img src="https://media0.giphy.com/media/3oKIPdiPGxPI7Dze7u/giphy.gif?cid=ecf05e475f5bct6ci09g3pgn43nf6bausx33fj7f96f6ig92&rid=giphy.gif&ct=g" />
            <p>
              'memegle' is powered by GIPHY, the top source for the best & newest GIFs & Animated
              Stickers online. You can find any gif uploaded on GIPHY here.
            </p>
            <br />

            <img src="https://giphy.com/static/img/artistdirectory_1040.gif" />
            <p>
              If you want more, you are always welcome to contribute as an artist. Please refer to
              the guideline&nbsp;
              <a href="https://support.giphy.com/hc/en-us/articles/360019977552-How-to-Upload">
                here
              </a>
              &nbsp;and upload your work!
            </p>
            <br />
            <p>Here are some artists you can refer to.</p>
            <br />
            <section>
              <ArtistList artists={artists} />
            </section>
          </div>
        )}
      </section>
    </>
  );
};

export default HelpPanel;
