declare namespace NodeJS {
  interface ProcessEnv {
    BASE_PATH?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
