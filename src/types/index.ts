// 导出所有类型定义
export * from './dict'

export type Recordable<T = any, K extends PropertyKey = string> = Record<K, T>
export type Nullable<T> = T | null
export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
export interface Fn<T = any> {
  (...arg: T[]): T
}
export type ComponentRef<T extends any = any> = T extends new (...args: any) => any
  ? InstanceType<T>
  : T
