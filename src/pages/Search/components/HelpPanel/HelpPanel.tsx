import { memo, useRef, useState } from 'react';
import { AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames/bind';

import ArtistList from '../ArtistList/ArtistList';
import { getArtists } from './artistUtil';

import styles from './HelpPanel.module.css';

const cx = classNames.bind(styles);

const HelpPanel = (): JSX.Element => {
  const artists = getArtists();
  const [isShow, setIsShow] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openSheet = (): void => {
    setHasOpened(true);
    setIsShow(true);
  };
  const closeSheet = (): void => {
    setIsShow(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.floatingButton}
        onClick={openSheet}
        aria-label="Open help"
        aria-expanded={isShow}
        aria-controls="help-panel"
      >
        <AiOutlineInfo color="white" size="24px" />
      </button>
      <section
        id="help-panel"
        aria-label="About Memegle"
        aria-hidden={!isShow}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closeSheet();
        }}
        className={cx('selectedItemContainer', {
          showSheet: isShow
        })}
      >
        <div className={styles.sheetTitleContainer}>
          <h4>What&apos;s all this? </h4>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close help"
            tabIndex={isShow ? 0 : -1}
          >
            <AiOutlineClose size="24px" />
          </button>
        </div>
        {hasOpened && (
          <div className={styles.sheetContentsContainer}>
            <img
              alt="GIPHY animation"
              width="500"
              height="281"
              loading="lazy"
              decoding="async"
              src="https://media0.giphy.com/media/3oKIPdiPGxPI7Dze7u/giphy.gif?cid=ecf05e475f5bct6ci09g3pgn43nf6bausx33fj7f96f6ig92&rid=giphy.gif&ct=g"
            />
            <p>
              &apos;memegle&apos; is powered by GIPHY, the top source for the best & newest GIFs &
              Animated Stickers online. You can find any gif uploaded on GIPHY here.
            </p>
            <br />

            <img
              alt="GIPHY artists"
              width="1040"
              height="150"
              loading="lazy"
              decoding="async"
              src="https://giphy.com/static/img/artistdirectory_1040.gif"
            />
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

export default memo(HelpPanel);
