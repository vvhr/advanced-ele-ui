import type { Component } from 'vue'
import type { FormImportItem, TableFormImportItem } from '@/types/imports'
import { shallowReactive } from 'vue'
import { logger } from '@/locale'

type Components = Record<string, Component>
type ComponentConfigs = Record<string, any>
type ArrayStrategies = Record<string, (cps: Recordable) => boolean>

/**
 * 全局Form组件注册器
 */
class GlobalFormImports {
  components: Components = shallowReactive({})
  componentConfigs: ComponentConfigs = shallowReactive({})
  arrayStrategies: ArrayStrategies = shallowReactive({})

  registerComponents(imports: FormImportItem[]) {
    imports.forEach(item => {
      this.registerComponent(item.name, item.component, item.config, item.isArrayFn)
    })
  }

  registerComponent(
    name: string,
    component: Component,
    config?: any,
    isArrayFn?: (cps: Recordable) => boolean
  ) {
    if (this.components[name]) {
      logger.warn('console.form.componentExists', { name })
    }
    this.components[name] = component

    if (config) {
      if (this.componentConfigs[name]) {
        logger.warn('console.form.configExists', { name })
      }
      this.componentConfigs[name] = config
    }

    if (isArrayFn) {
      this.arrayStrategies[name] = isArrayFn
    }

    logger.success('console.form.componentRegistered', { name })
  }
}

/**
 * 全局Table组件注册器
 */
class GlobalTableImports {
  components: Components = shallowReactive({})
  componentConfigs: ComponentConfigs = shallowReactive({})
  arrayStrategies: ArrayStrategies = shallowReactive({})

  registerComponents(imports: TableFormImportItem[]) {
    imports.forEach(item => {
      this.registerComponent(item.name, item.component, item.config, item.isArrayFn)
    })
  }

  registerComponent(
    name: string,
    component: Component,
    config?: any,
    isArrayFn?: (cps: Recordable) => boolean
  ) {
    if (this.components[name]) {
      logger.warn('console.table.componentExists', { name })
    }
    this.components[name] = component

    if (config) {
      if (this.componentConfigs[name]) {
        logger.warn('console.table.configExists', { name })
      }
      this.componentConfigs[name] = config
    }

    if (isArrayFn) {
      this.arrayStrategies[name] = isArrayFn
    }

    logger.success('console.table.componentRegistered', { name })
  }
}

// 导出全局单例
export const globalFormImports = new GlobalFormImports()
export const globalTableImports = new GlobalTableImports()
