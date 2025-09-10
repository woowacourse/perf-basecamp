import { useState, Suspense, lazy } from 'react';
import { AiOutlineInfo } from 'react-icons/ai';
import styles from './HelpPanel.module.css';

const HelpModal = lazy(() => import('./HelpModal'));

const HelpPanel = () => {
  const [isShow, setIsShow] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const openSheet = () => setIsShow(true);
  const closeSheet = () => setIsShow(false);

  const handleMouseEnter = () => {
    setShouldLoad(true);
  };

  return (
    <>
      <button
        type="button"
        className={styles.floatingButton}
        onClick={openSheet}
        onMouseEnter={handleMouseEnter}
        aria-label="도움말 열기"
      >
        <AiOutlineInfo color="white" size="24px" />
      </button>
      {shouldLoad && (
        <Suspense fallback={<div>Loading...</div>}>
          <HelpModal isShow={isShow} closeSheet={closeSheet} />
        </Suspense>
      )}
    </>
  );
};

export default HelpPanel;
