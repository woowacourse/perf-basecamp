declare type valueof<O extends object> = O[keyof O];

declare type PromiseFunction<T = undefined> = T extends undefined
  ? (...args: any[]) => Promise<any>
  : (...args: any[]) => Promise<T>;
