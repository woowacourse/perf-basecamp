import { Suspense, useState } from 'react';
import { AiOutlineInfo } from '@react-icons/all-files/ai/AiOutlineInfo';

import styles from './HelpPanel.module.css';
import lazyWithPreload from '../../../../utils/lazyWithPreload';

const [Panel, preloadPanel] = lazyWithPreload(() => import('./Panel'));

const HelpPanel = () => {
  const [isShow, setIsShow] = useState(false);
  const openSheet = () => setIsShow(true);
  const closeSheet = () => setIsShow(false);

  return (
    <>
      <button type="button" className={styles.floatingButton} onClick={openSheet}>
        <AiOutlineInfo color="white" size="24px" onMouseEnter={preloadPanel} />
      </button>
      <Suspense fallback={null}>
        {isShow && <Panel isShow={isShow} closeSheet={closeSheet} />}
      </Suspense>
    </>
  );
};

export default HelpPanel;
