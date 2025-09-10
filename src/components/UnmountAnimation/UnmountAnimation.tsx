import {
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";

interface UnmountAfterAnimationProps {
  visible: boolean;

}

function UnmountAfterAnimation({
  visible,
  children,
}: PropsWithChildren<UnmountAfterAnimationProps>) {
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  const refCallback = (element: HTMLElement | null) => {
    if (!element || visible) {
      return;
    }

    const animations = element.getAnimations({ subtree: true });
    Promise.all(animations.map((animation) => animation.finished)).finally(
      () => {
        setMounted(false);
      },
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div  ref={refCallback}>
      {children}
    </div>
  );
}

export default UnmountAfterAnimation;
