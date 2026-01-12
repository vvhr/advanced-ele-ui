import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
): SFCWithInstall<T> & E => {
  ;(main as SFCWithInstall<T>).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      const compName = (comp as any).name || (comp as any).__name
      if (compName) {
        // 检查组件是否已经注册，避免重复注册
        // app.component 在组件已存在时会返回已注册的组件，否则返回 undefined
        const existingComponent = (app as any)._context?.components?.[compName]
        if (!existingComponent) {
          app.component(compName, comp)
        }
      }
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}
