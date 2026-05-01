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
  // 使用泛型显式声明响应式对象的类型，避免 Vue 3.5+ 中 shallowReactive 类型推断
  // 出现 ShallowReactiveBrandClass 缺少字符串索引签名的报错
  components: Components = shallowReactive<Components>({})
  componentConfigs: ComponentConfigs = shallowReactive<ComponentConfigs>({})
  arrayStrategies: ArrayStrategies = shallowReactive<ArrayStrategies>({})

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
    const loggerRecords = {
      componentExists: [],
      componentRegistered: [],
      configExists: []
    }
    if (this.components[name]) {
      loggerRecords.componentExists.push(name)
    }
    this.components[name] = component

    if (config) {
      if (this.componentConfigs[name]) {
        loggerRecords.configExists.push(name)
      }
      this.componentConfigs[name] = config
    }

    if (isArrayFn) {
      this.arrayStrategies[name] = isArrayFn
    }

    loggerRecords.componentRegistered.push(name)
    logger.warn('console.form.componentExists', { names: loggerRecords.componentExists.join(', ') })
    logger.warn('console.form.configExists', { names: loggerRecords.configExists.join(', ') })
    logger.success('console.form.componentRegistered', {
      names: loggerRecords.componentRegistered.join(', ')
    })
  }
}

/**
 * 全局Table组件注册器
 */
class GlobalTableImports {
  // 使用泛型显式声明响应式对象的类型，避免 Vue 3.5+ 中 shallowReactive 类型推断
  // 出现 ShallowReactiveBrandClass 缺少字符串索引签名的报错
  components: Components = shallowReactive<Components>({})
  componentConfigs: ComponentConfigs = shallowReactive<ComponentConfigs>({})
  arrayStrategies: ArrayStrategies = shallowReactive<ArrayStrategies>({})

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
    const loggerRecords = {
      componentExists: [],
      componentRegistered: [],
      configExists: []
    }
    if (this.components[name]) {
      loggerRecords.componentExists.push(name)
    }
    this.components[name] = component

    if (config) {
      if (this.componentConfigs[name]) {
        loggerRecords.configExists.push(name)
      }
      this.componentConfigs[name] = config
    }

    if (isArrayFn) {
      this.arrayStrategies[name] = isArrayFn
    }

    loggerRecords.componentRegistered.push(name)
    logger.warn('console.table.componentExists', { names: loggerRecords.componentExists.join(', ') })
    logger.warn('console.table.configExists', { names: loggerRecords.configExists.join(', ') })
    logger.success('console.table.componentRegistered', {
      names: loggerRecords.componentRegistered.join(', ')
    })
  }
}

// 导出全局单例
export const globalFormImports = new GlobalFormImports()
export const globalTableImports = new GlobalTableImports()
