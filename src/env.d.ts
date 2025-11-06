/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展 Vue JSX 类型以支持 vModel
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      vModel?: any
      'v-model'?: any
    }
  }
}
