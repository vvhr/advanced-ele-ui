declare global {
  // 通用类型定义
  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }
  declare type Nullable<T> = T | null
  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>
  declare type ComponentRef<T> = InstanceType<T>
}

export {}
