// 组件库全局类型定义
// 用户可以在项目中引用此文件来获得全局类型支持

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
