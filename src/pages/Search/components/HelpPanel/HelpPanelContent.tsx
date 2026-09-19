import { useEffect, useState } from 'react';
import { getArtists } from './artistUtil';
import classNames from 'classnames/bind';
import { AiOutlineClose } from 'react-icons/ai';
import ArtistList from '../ArtistList/ArtistList';
import styles from './HelpPanelContent.module.css';

interface Props {
  isShow: boolean;
  onClose: () => void;
}

const cx = classNames.bind(styles);

export default function HelpPanelContent({ isShow, onClose }: Props): JSX.Element {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let revealFrame = 0;
    // Paint the hidden state before starting the first opening transition.
    const paintFrame = requestAnimationFrame(() => {
      revealFrame = requestAnimationFrame(() => setIsReady(true));
    });

    return () => {
      cancelAnimationFrame(paintFrame);
      cancelAnimationFrame(revealFrame);
    };
  }, []);

  const artists = getArtists();
  return (
    <section
      className={cx('selectedItemContainer', {
        showSheet: isReady && isShow
      })}
      aria-hidden={!isShow}
    >
      <div className={styles.sheetTitleContainer}>
        <h4>What's all this? </h4>
        <button type="button" aria-label="도움말 닫기" onClick={onClose}>
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
          <a href="https://support.giphy.com/hc/en-us/articles/360019977552-How-to-Upload">here</a>
          &nbsp;and upload your work!
        </p>
        <br />
        <p>Here are some artists you can refer to.</p>
        <br />
        <section>
          <ArtistList artists={artists} />
        </section>
      </div>
    </section>
  );
}
