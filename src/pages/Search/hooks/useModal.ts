import { useCallback, useState } from 'react';

type useModalProps = {
  defaultOpen?: boolean;
  /**
   * 모달이 닫히는 애니메이션을 위한 isOpen 속성 변경의 딜레이 시간(ms)입니다. 모달 애니메이션 시간보다 길어야 합니다.
   */
  closeDelay: number;
};

export const useModal = ({ defaultOpen = false, closeDelay }: useModalProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isVisible, setIsVisible] = useState(defaultOpen);

  const openModal = useCallback(() => {
    setIsVisible(true);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);

    setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  }, []);

  return {
    isOpen,
    isVisible,
    openModal,
    closeModal
  };
};
