const withRequestAnimationFrame = (callback: Function) => {
  let id = 0;

  return () => {
    if (id !== 0) cancelAnimationFrame(id);
    id = requestAnimationFrame(() => callback());
  };
};

const Throttle = {
  withRequestAnimationFrame
};

export default Throttle;
