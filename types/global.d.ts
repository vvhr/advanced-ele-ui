declare global {
  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
  interface Fn<T = any> {
    (...arg: T[]): T
  }
  type Nullable<T> = T | null
  type Recordable<T = any, K extends PropertyKey = string> = Record<K, T>
  type ComponentRef<T extends any = any> = T extends new (...args: any) => any ? InstanceType<T> : T
}

export {}
