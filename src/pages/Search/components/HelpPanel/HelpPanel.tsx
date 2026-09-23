import { memo, useState } from 'react';
import { AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames/bind';

import ArtistList from '../ArtistList/ArtistList';
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
        {/*
          패널은 닫혀 있을 때 CSS로만 가려져 있었다. 내용이 DOM에 그대로 남아
          안내 이미지 2개(합계 4.65MB)가 매번 다운로드되고 ArtistInfo 100개가
          리렌더 대상이 됐다. 열려 있을 때만 렌더한다.
        */}
        {isShow && (
          <div className={styles.sheetContentsContainer}>
            <img
              src="https://media0.giphy.com/media/3oKIPdiPGxPI7Dze7u/giphy.gif?cid=ecf05e475f5bct6ci09g3pgn43nf6bausx33fj7f96f6ig92&rid=giphy.gif&ct=g"
              alt="GIPHY powered"
              loading="lazy"
            />
            <p>
              'memegle' is powered by GIPHY, the top source for the best & newest GIFs & Animated
              Stickers online. You can find any gif uploaded on GIPHY here.
            </p>
            <br />

            <img
              src="https://giphy.com/static/img/artistdirectory_1040.gif"
              alt="GIPHY artist directory"
              loading="lazy"
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

// props가 없으므로 부모가 리렌더돼도 이 트리는 다시 그리지 않는다.
export default memo(HelpPanel);
