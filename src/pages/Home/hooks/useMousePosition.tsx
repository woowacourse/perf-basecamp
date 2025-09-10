import { useEffect, useRef, useState } from 'react';

export type MousePosition = Partial<MouseEvent>;

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const frame = useRef<number>(); // requestAnimationFrame 예약 ID를 저장할 ref
  const latestEvent = useRef<MouseEvent>(); // 가장 마지막 mousemove 이벤트 객체를 저장할 ref

  useEffect(() => {
    const update = () => {
      if (latestEvent.current) {
        // 최신 mousemove 이벤트에서 좌표 추출
        const { clientX, clientY, pageX, pageY, offsetX, offsetY } = latestEvent.current;
        setMousePosition({ clientX, clientY, pageX, pageY, offsetX, offsetY });
      }
      // 다음 프레임 예약을 위해 frame ref를 비움
      frame.current = undefined;
    };

    // mousemove 이벤트가 발생할 때마다 실행
    const onMouseMove = (e: MouseEvent) => {
      // 이벤트 객체를 ref에 저장 (여러 번 발생해도 마지막 값만 유지)
      latestEvent.current = e;
      // 이미 예약된 프레임이 없으면, 다음 프레임에 update 실행 예약
      if (!frame.current) {
        frame.current = requestAnimationFrame(update);
      }
    };

    // mousemove 이벤트 리스너 등록
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      window.removeEventListener('mousemove', onMouseMove);
      // 남아있는 rAF 예약이 있으면 취소
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  // 최신 마우스 위치 반환
  return mousePosition;
};

// 커스텀 훅 export
export default useMousePosition;
