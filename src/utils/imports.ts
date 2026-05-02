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
    const loggerRecords = {
      componentExists: [],
      componentRegistered: [],
      configExists: []
    }
    imports.forEach(item => {
      this.registerComponent(loggerRecords, item.name, item.component, item.config, item.isArrayFn)
    })
    if (loggerRecords.componentExists.length) {
      logger.warn('console.form.componentExists', {
        name: loggerRecords.componentExists.join(', ')
      })
    }
    if (loggerRecords.configExists.length) {
      logger.warn('console.form.configExists', { name: loggerRecords.configExists.join(', ') })
    }
    if (loggerRecords.componentRegistered.length) {
      logger.success('console.form.componentRegistered', {
        name: loggerRecords.componentRegistered.join(', ')
      })
    }
  }

  registerComponent(
    loggerRecords: any,
    name: string,
    component: Component,
    config?: any,
    isArrayFn?: (cps: Recordable) => boolean
  ) {
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
    const loggerRecords = {
      componentExists: [],
      componentRegistered: [],
      configExists: []
    }
    imports.forEach(item => {
      this.registerComponent(loggerRecords, item.name, item.component, item.config, item.isArrayFn)
    })
    if (loggerRecords.componentExists.length) {
      logger.warn('console.table.componentExists', {
        name: loggerRecords.componentExists.join(', ')
      })
    }
    if (loggerRecords.configExists.length) {
      logger.warn('console.table.configExists', { name: loggerRecords.configExists.join(', ') })
    }
    if (loggerRecords.componentRegistered.length) {
      logger.success('console.table.componentRegistered', {
        name: loggerRecords.componentRegistered.join(', ')
      })
    }
  }

  registerComponent(
    loggerRecords: any,
    name: string,
    component: Component,
    config?: any,
    isArrayFn?: (cps: Recordable) => boolean
  ) {
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
  }
}

// 导出全局单例
export const globalFormImports = new GlobalFormImports()
export const globalTableImports = new GlobalTableImports()
