import { Suspense } from 'react';
import { AiOutlineInfo } from '@react-icons/all-files/ai/AiOutlineInfo';

import styles from './HelpPanel.module.css';
import lazyWithPreload from '../../../../utils/lazyWithPreload';
import { useModal } from '../../hooks/useModal';

const [Panel, preloadPanel] = lazyWithPreload(() => import('./Panel'));

const HelpPanel = () => {
  const {
    isVisible: isShow,
    openModal: openSheet,
    closeModal: closeSheet,
    isOpen
  } = useModal({ closeDelay: 600 });

  return (
    <>
      <button type="button" className={styles.floatingButton} onClick={openSheet}>
        <AiOutlineInfo color="white" size="24px" onMouseEnter={preloadPanel} />
      </button>
      <Suspense fallback={null}>
        {isOpen && <Panel isShow={isShow} closeSheet={closeSheet} />}
      </Suspense>
    </>
  );
};

export default HelpPanel;
