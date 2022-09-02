const getCurrentTimeInSeconds = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export default getCurrentTimeInSeconds;
