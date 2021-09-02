import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const Context = createContext(null);

const GlobalStateProvider = ({ children }) => {
  const globalState = useRef({});

  const getGlobalState = (key) => {
    return globalState.current[key];
  };

  const setGlobalState = (key, value) => {
    globalState.current = {
      ...globalState.current,
      [key]: value,
    };
  };

  const contextValue = useMemo(
    () => ({
      getGlobalState,
      setGlobalState,
    }),
    []
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useGlobalState = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("잘못된 사용입니다.");
  }

  return context;
};

export default GlobalStateProvider;
