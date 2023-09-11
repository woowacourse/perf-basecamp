const createObserver = (onIntersecting: () => void) =>
  new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) {
        onIntersecting();
      }
    });
  });

export default createObserver;
