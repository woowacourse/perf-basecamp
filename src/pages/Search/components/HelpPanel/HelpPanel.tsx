import { memo, useState, lazy, Suspense } from 'react';
import { AiOutlineInfo } from 'react-icons/ai';

import styles from './HelpPanel.module.css';

const HelpPanelContent = lazy(async () => await import('./HelpPanelContent'));

const HelpPanel = (): JSX.Element => {
  const [hasOpened, setHasOpened] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const openSheet = (): void => {
    setHasOpened(true);
    setIsShow(true);
  };
  const closeSheet = (): void => setIsShow(false);

  return (
    <>
      <button
        type="button"
        className={styles.floatingButton}
        aria-label="도움말 열기"
        aria-expanded={isShow}
        onClick={openSheet}
      >
        <AiOutlineInfo color="white" size="24px" />
      </button>
      {hasOpened && (
        <Suspense fallback={<p className={styles.contentFallback}>불러오는중</p>}>
          <HelpPanelContent isShow={isShow} onClose={closeSheet} />
        </Suspense>
      )}
    </>
  );
};

export default memo(HelpPanel);
